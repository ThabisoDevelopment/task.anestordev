import connection from "../database/connection"
import dayjs from "dayjs"

class TaskController {

    async index(request, response) {
        try {
            const statement = "SELECT * FROM tasks WHERE user_id=?"
            const { [0]: results } = await connection.promise().query(statement, [ request.user.id])
            results.forEach(async task => {
                task.start_date = dayjs(task.start_date).format("DD-MMM-YYYY")
                task.end_date = dayjs(task.end_date).format("DD-MMM-YYYY")
                task.created_at = dayjs(task.created_at).format("DD-MMM-YYYY HH:mm")
                task.updated_at = dayjs(task.updated_at).format("DD-MMM-YYYY HH:mm")
                return task
            })
            response.send(results)
        } catch (error) {
            response.status(500).send({ message: error.message })
        }
    }

    show(request, response) {
        const statement = "SELECT * FROM tasks WHERE user_id=? AND id=?"
        const data = [ request.user.id , request.params.id ]
        connection.execute(statement, data, (error, results) => {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            if (results.length < 1) return response.status(404).send({ message: "sorry! This task does not exist" })
            results[0].start_date = dayjs(results[0].start_date).format("DD-MMM-YYYY")
            results[0].end_date = dayjs(results[0].end_date).format("DD-MMM-YYYY")
            results[0].created_at = dayjs(results[0].created_at).format("DD-MMM-YYYY HH:mm")
            results[0].updated_at = dayjs(results[0].updated_at).format("DD-MMM-YYYY HH:mm")
            response.send(results[0])
        })
    }

    create(request, response) {
        if (!request.body.name) return response.status(422).send({ message: "The name of the task is required" })
        const data = [
            request.user.id,
            request.body.name,
            request.body.description,
            request.body.start_date,
            request.body.end_date
        ]
        const statement = "INSERT INTO tasks(user_id, name, description, start_date, end_date) VALUES(?, ?, ?, ?, ?)"
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.status(201).send({
                message: "New Task has been created",
                task_id: results.insertId
            })
        })
    }

    update(request, response) {
        if (!request.body.name) return response.status(422).send({ message: "The name of the task is required" })
        const data = [
            request.body.name,
            request.body.description,
            request.body.end_date,
            request.params.id,
            request.user.id
        ]
        const statement = `UPDATE tasks SET name=?, description=?, end_date=? WHERE id=? AND user_id=?`
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.status(200).send({
                message: "Task has been updated",
                task_id: request.params.id
            })
        })
    }

    completed(request, response) {
        if (request.body.completed == null) return response.status(422).send({ message: "The completed value is required" })
        const data = [
            request.body.completed,
            request.params.id,
            request.user.id,
        ]
        const statement = "UPDATE tasks SET completed=? WHERE id=? AND user_id=?"
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: error })
            response.status(200).send({
                message: "Task has been updated",
                task_id: request.params.id,
                completed: request.body.completed
            })
        })
    }

    destroy(request, response) {
        const statement = "DELETE FROM tasks WHERE user_id=? AND id=?"
        const data = [ request.user.id , request.params.id ]
        connection.execute(statement, data, (error, results) => {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.send({ message: "Task Have been Deleted"})
        })
    }
}

export default new TaskController