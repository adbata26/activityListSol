const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);                           
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const todoContractAddress = "0xD301E0563C506FC832576a85d6Aea8364aCa4703";
const todoAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "content",
        "type": "string"
      }
    ],
    "name": "TaskCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "TaskDeleted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "createTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "deleteTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getTask",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "content",
            "type": "string"
          },
          {
            "internalType": "enum Todo.TaskStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct Todo.Task",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "taskCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tasks",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "enum Todo.TaskStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }

];

const todoContract = new ethers.Contract(todoContractAddress, todoAbi, wallet);

app.post("/tasks", async (req, res) => {
  try {
    const tx = await todoContract.createTask(req.body.content);
    await tx.wait();
    res.send({ status: "Task added" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const tx = await todoContract.deleteTask(req.params.id);
    await tx.wait();
    res.send({ status: "Task deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tasks", async (req, res) => {
    try {
      let tasks = [];
      const taskCount = await todoContract.taskCount();
      for (let i = 1; i <= taskCount; i++) {
        const task = await todoContract.tasks(i);
        tasks.push({
          id: task.id.toNumber(),
          content: task.content,
          status: task.status,
        });
      }
      res.send(tasks);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  
  
app.listen(4000, () => console.log("Server running on port 4000"));
