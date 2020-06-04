# the-power-of-without

The Power of Without is a collaborative initiative among institutions and local communities for identifying cost-efficient, lightweight infrastructure systems for deployment in informal settlements, to foster sustainable, resilient, and autonomous communities. A taxonomy, and methodology based in a set of workshops and classes has been developed to learn from informality.

https://www.media.mit.edu/projects/power-of-without-1/overview/

## Getting Started

This project runs off a Node.js backend, with a MongoDB database. Follow these steps to run the project locally: 

### Installing Dependencies 

(This step only needs to be done once)

- Clone the repository locally: `git clone https://github.com/guadalupebabio/ThePowerofWithout.git`
- In the project folder, install the packages: `npm install`
  - Make sure npm is installed. If not, you can follow the instructions to download it [here](https://www.npmjs.com/get-npm).
- Install MongoDB community edition on your computer. You can find the download [here](https://docs.mongodb.com/manual/administration/install-community/). 
  - Once you're done, typing `mongod` in the terminal should work.
  - Keep in mind that your local database is different from the database others are working from. 

### Running the Server 

(This step should be run everytime)

- First, start the database by typing `mongod` in your terminal 
- Then, in another terminal window, run `node index.js` in the project repository 
- If everything works properly, going to localhost:3000 in your browser should work. 
- *Important*: everytime you change the code, you need to re-run `node index.js` for the changes to be reflected. 
  - (This is really annoying, so a potential workaround is [node-dev](https://www.npmjs.com/package/node-dev), which automatically restarts node on any changes to the code. Once you've installed node-dev, you can run `node-dev index.js` instead of `node index.js`.


  
