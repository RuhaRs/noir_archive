import 'dotenv/config';
import {PrismaClient} from '@prisma/client';
import argon2 from 'argon2';
const db=new PrismaClient();
const brands=['Maison Margiela','MM6','Jean Paul Gaultier','Chrome Hearts','Rick Owens','Yohji Yamamoto','Comme des Garçons','Ann Demeulemeester','Julius','1017 ALYX 9SM','Undercover','Acne Studios'];
const families=[['T-shirt','Футболки','S,M,L,XL',23900],['Oversized hoodie','Худи','S,M,L,XL',57900],['Sculptural ring','Кольца','16,17,18,19,20,21',43900],['Eau de parfum','Парфюмерия','50 ml,100 ml',73900],['Archive jacket','Куртки','S,M,L',122900],['Chain necklace','Цепочки','ONE SIZE',60900],['Wide trousers','Брюки','S,M,L,XL',68900],['Leather accessory','Аксессуары','ONE SIZE',32900]];
for(let i=0;i<32;i++){
 const b=brands[i%brands.length], f=families[i%families.length],name=`${f[0]} / ${String(i+1).padStart(2,'0')}`;
 const id=`demo-${String(i+1).padStart(2,'0')}`;
 await db.product.upsert({where:{id},update:{},create:{id,name,brand:b,category:f[1],sizes:f[2],price:f[3]+Math.floor(i/8)*4000,stock:5+i%14,featured:i<8,description:'Демонстрационная карточка. Название, цена и наличие вымышлены; товар не является подтверждённым предложением бренда.',image:''}});
}
if(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD){
 if(process.env.ADMIN_PASSWORD.length<12)throw Error('ADMIN_PASSWORD must be at least 12 characters');
 await db.user.upsert({where:{email:process.env.ADMIN_EMAIL.toLowerCase()},update:{role:'ADMIN'},create:{firstName:'Store',lastName:'Admin',email:process.env.ADMIN_EMAIL.toLowerCase(),passwordHash:await argon2.hash(process.env.ADMIN_PASSWORD,{type:argon2.argon2id}),role:'ADMIN'}});
 console.log('Admin account created/updated: '+process.env.ADMIN_EMAIL);
} else console.log('Admin not created. Provide ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env then rerun seed.');
console.log('Seed complete');await db.$disconnect();
