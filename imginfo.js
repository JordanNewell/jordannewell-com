const b=require("fs").readFileSync("public/images/jordan-newell-one.png");
console.log("dimensions:",b.readUInt32BE(16)+"x"+b.readUInt32BE(20),"bytes:",b.length);
