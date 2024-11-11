async function main() {
    const Todo = await ethers.getContractFactory("Todo");
    const todo = await Todo.deploy();
    await todo.deployed();
  
    console.log("Todo contract deployed to:", todo.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
      //npm install dotenv @nomiclabs/hardhat-ethers ethers axios express body-parser cors
    //npx hardhat compile
    //npx hardhat run scripts/deploy.js --network sepolia

