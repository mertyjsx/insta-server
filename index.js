const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./userModel");

const port = process.env.PORT || 4000;

const Arrayid = [];

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://enes123:enes123@cluster0.3cmvt.mongodb.net/insta?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/* function dbAtma(item) {
  let user = {};
  item.map(
    (i) =>
      (user = {
        id: i.node.id,
        followed: false,
      })
  );

  User.create(user, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
} */

const getUsers=async ()=>{

return await User.find({}, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      
     
    }
  });
}
const getOneUser=async ()=>{

  return await User.findOne({ followed: false }, function (err, adventure) {


  });
    
  }
  



function start(cookie,body) {
  
  follow(cookie,body);
  
}
async function follow(headers,body) {
  console.log("Başladı");
  await sleep(2000);
  console.log("Two seconds later, showing sleep in a loop...");

  // Sleep in loop
 const interval=setInterval(async () => {
  
    const user= await getOneUser()
    console.log(user)
  
    axios({
      method: "post", //you can set what request you want to be
      url: `https://www.instagram.com/web/friendships/${user.id}/follow/`,

      headers: headers
    })
      .then((response) => {
       
       console.log(response.data)
     console.log(body.query.account)

     if(response.data.result==="following"||response.data.result==="requested"){
      User.updateOne(
        { _id: user._id }, // Filter
        { $set: { followed: true,log:response.data.result,time: new Date(),account:body.query.account } } // Update
      )
        .then((obj) =>    console.log("updated"))
        .catch((err) => console.log(err));


     }

      
  


      })
      .catch((e) => console.log(e));
      






 }, 30000);
      
     
 
}

function showid(array, cookie) {
  array.map((item) => {
    item.map((item) => Arrayid.push(item.node.id));
  });
  setTimeout(() => {
    //follow(cookie);
  }, 3000);
}

/* async function start(name, cookie) {
  //console.log(name);
  //console.log(`https://www.instagram.com/${name}/?__a=1`);
  //"etsy" yazarak etsynin idsini alıyoruz aslında direk idsini bulabilirz ama sonradan bugra yazdıgımızda otomatik onun kullanıclarını almıs olcaz daha rahat
  axios({
    method: "get", //you can set what request you want to be
    url: `https://www.instagram.com/${name}/?__a=1`,

    headers: {
      cookie: cookie,
      "sec-fetch-dest": "empty",

      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",

      "x-ig-app-id": 936619743392459,
      "x-ig-www-claim": "hmac.AR3EgGFPrRp7lMoflSHG-AggQXPR8gqcknUibswg0xaolnOy",
      "x-requested-with": "XMLHttpRequest",
    },
  }).then((n) => {
    //kullanıcı id sini aldık
    let userid = n.data.logging_page_id.split("_")[1];
    //console.log(userid);
    //alttaki url followersları alma urlsi ama ilk follower çekişle sonrakiler farklı
    let url = `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=%7B%22id%22%3A%22${userid}%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Atrue%2C%22first%22%3A24%7D`;
    //console.log(url);
    axios({
      method: "get", //you can set what request you want to be
      url: url,

      headers: {
        cookie: cookie,
        "sec-fetch-dest": "empty",

        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        referer: "https://www.instagram.com/tomascorekulan/following/",
        "x-ig-app-id": 936619743392459,
        "x-ig-www-claim":
          "hmac.AR3EgGFPrRp7lMoflSHG-AggQXPR8gqcknUibswg0xaolnOy",
        "x-requested-with": "XMLHttpRequest",
      },
    }).then((response) => {
      //followersları çektik yanında kullancılar ve after geldi sonra bunu loopa alıcaz aşagıda
      let obj = response.data.data.user.edge_follow;

      let after = obj.page_info.end_cursor;
      //console.log(obj);
      let Array = [];
      //Array.push(obj.edges)

      let newurl = `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=%7B%22id%22%3A%22${userid}%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Atrue%2C%22first%22%3A200%2C%22after%22%3A%22${
        after.split("==")[0]
      }%3D%3D%22%7D`;

      const inter = setInterval(() => {
        axios({
          method: "get", //you can set what request you want to be
          url: newurl,

          headers: {
            cookie: cookie,
            "sec-fetch-dest": "empty",

            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            referer: "https://www.instagram.com/tomascorekulan/following/",
            "x-ig-app-id": 936619743392459,
            "x-ig-www-claim":
              "hmac.AR3EgGFPrRp7lMoflSHG-AggQXPR8gqcknUibswg0xaolnOy",
            "x-requested-with": "XMLHttpRequest",
          },
        })
          .then((response) => {
            newurl = `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=%7B%22id%22%3A%22${userid}%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Atrue%2C%22first%22%3A100%2C%22after%22%3A%22${
              response.data.data.user.edge_followed_by.page_info.end_cursor.split(
                "=="
              )[0]
            }%3D%3D%22%7D`;
            dbAtma(response.data.data.user.edge_followed_by.edges);
            //yukarıdaki direk id si her request sonrası new url üretiyoruz çünkü after şeyleri farklı hepsinin
            if (Array.length > 50) {
              //50 ye ulaştıgında durdur
              clearInterval(inter);
            }
          })
          .catch();
      }, 3000);
    });
  });
}
 */
app.get('/info',async (req, res) =>{

const users= await getUsers()
console.log(users)
res.status(200).send({users:users})

})
app.post("/follow", async (req, res) => {








  start(req.headers,req).then(() => res.send("basladı"));
});

app.listen(port, () =>
{

  console.log(`Example app listening at http://localhost:${port}`)
}
);
