# How to run on your local Machine

## Get the code

```
git clone https://github.com/yongjiahuang134/cs35LProject.git
cd ./cs35LProject
npm install
```

## Connect to Mongodb

You can sign up MongoDB Atlas account on [here](https://www.mongodb.com/atlas/database)

Create a .env file inside root directory of the cloned repository. Defined MONGODB_API be the mongodb connection string of your cluster.

Your .env file should look like this:

```
mongodb+srv://username:password@cluster0.qusbyem.mongodb.net/?retryWrites=true&w=majority
```

## Run Frontend

```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Run Backend

```
npx nodemon src/Backend/send.js
```

# Creators

[Jingran Zhang](https://github.com/Mochimomomo)
[Yongjia Huang](https://github.com/yongjiahuang134)
[Jiaqi Yang](https://github.com/Jackiexxxx666)
[Jordan Jiang](https://github.com/joyuan02)
[Eric Jin](https://github.com/erikkkun)
