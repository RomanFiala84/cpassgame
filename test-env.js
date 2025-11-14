require('dotenv').config();

console.log('\n====================================');
console.log('   Environment Variables Check');
console.log('====================================\n');

const vars = {
  'MongoDB URI': process.env.MONGODB_URI,
  'Cloudinary Cloud Name': process.env.CLOUDINARY_CLOUD_NAME,
  'Cloudinary API Key': process.env.CLOUDINARY_API_KEY,
  'Cloudinary API Secret': process.env.CLOUDINARY_API_SECRET,
  'Cloudinary Upload Preset': process.env.CLOUDINARY_UPLOAD_PRESET,
};

let allSet = true;

Object.entries(vars).forEach(([name, value]) => {
  if (value && value.trim() !== '') {
    console.log(`✅ ${name}`);
    
    // Zobraziť čiastočnú hodnotu (pre debug)
    if (name.includes('Secret') || name.includes('URI')) {
      console.log(`   Value: ${value.substring(0, 20)}...`);
    } else {
      console.log(`   Value: ${value}`);
    }
    console.log('');
  } else {
    console.log(`❌ ${name} - MISSING!\n`);
    allSet = false;
  }
});

console.log('====================================\n');

if (allSet) {
  console.log('✅ All environment variables are properly set!');
  console.log('✅ Ready to proceed to STEP 4!\n');
} else {
  console.log('❌ Please check your .env file and fill in missing values.\n');
  process.exit(1);
}
