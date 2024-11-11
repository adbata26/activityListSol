// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Todo {
    // Enum for Task Status
    enum TaskStatus { Created, Completed, Deleted }

    struct Task {
        uint id;
        string content;
        TaskStatus status;  // Task status now as an enum
    }

    uint public taskCount = 0;
    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string content);
    event TaskDeleted(uint id);

    // Function to create a task
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, TaskStatus.Created);
        emit TaskCreated(taskCount, _content);
    }

    // Function to delete a task by setting its status to "deleted"
    function deleteTask(uint _id) public {
        require(bytes(tasks[_id].content).length != 0, "Task does not exist");
        tasks[_id].status = TaskStatus.Deleted;
        emit TaskDeleted(_id);
    }

    // Function to get a task by its ID (only if status is "Created")
    function getTask(uint _id) public view returns (Task memory) {
        require(tasks[_id].status != TaskStatus.Created, "Task is not in 'Created' status");
        return tasks[_id];
    }
}
