import dayjs from "dayjs"
import connection from "../database/connection"

class TodoController {

    async index(request, response) {
        try {
            const statement = "SELECT * FROM todos WHERE user_id=? ORDER BY created_at DESC"
            const data = [ request.user.id ]
            const { [0]: results } = await connection.promise().query(statement, data)
            results.forEach(async todo => {
                todo.start_date = dayjs(todo.start_date).format("DD-MMM-YYYY")
                todo.end_date = dayjs(todo.end_date).format("DD-MMM-YYYY")
                todo.created_at = dayjs(todo.created_at).format("DD-MMM-YYYY")
                todo.updated_at = dayjs(todo.updated_at).format("DD-MMM-YYYY")
                return todo
            })
            response.send(results)
        } catch (error) {
            response.status(500).send({ message: error.message })
        }
    }

    show(request, response) {
        const statement = "SELECT * FROM todos WHERE id=? AND user_id=?"
        const data = [ request.params.id, request.user.id ]
        connection.execute(statement, data, (error, results) => {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            if (results.length < 1) return response.status(404).send({ message: "sorry! This todo does not exist" })
            results[0].start_date = dayjs(results[0].start_date).format("DD-MMM-YYYY")
            results[0].end_date = dayjs(results[0].end_date).format("DD-MMM-YYYY")
            results[0].created_at = dayjs(results[0].created_at).format("DD-MMM-YYYY")
            results[0].updated_at = dayjs(results[0].updated_at).format("DD-MMM-YYYY")
            response.send(results[0])
        })
    }

    create(request, response) {
        if (!request.body.name) return response.status(422).send({ message: "The name of todo is required" })
        const phase_id = request.params.phase_id? request.params.phase_id: null
        const has_phase = phase_id? 1: 0
        const data = [
            request.user.id,
            has_phase,
            phase_id,
            request.body.name,
            request.body.description,
            request.body.notes
        ]
        const statement = "INSERT INTO todos(user_id, has_phase, phase_id, name, description, notes) VALUES(?, ?, ?, ?, ?, ?)"
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.status(201).send({
                message: "New Todo has been created",
                todo_id: results.insertId
            })
        })
    }

    update(request, response) {
        if (!request.body.name) return response.status(422).send({ message: "The name of the todo is required" })
        const data = [
            request.body.name,
            request.body.description,
            request.body.notes,
            request.params.id,
            request.user.id
        ]
        const statement = `UPDATE todos SET name=?, description=?, notes=? WHERE id=? AND user_id=?`
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.status(200).send({
                message: "Todo has been updated",
                todo_id: request.params.id
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
        const statement = "UPDATE todos SET completed=? WHERE id=? AND user_id=?"
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: error })
            response.status(200).send({
                message: "Todo has been updated",
                phase_id: request.params.id,
                completed: request.body.completed
            })
        })
    }

    destroy(request, response) {
        const statement = "DELETE FROM todos WHERE id=? AND user_id=?"
        const data = [request.params.id, request.user.id]
        connection.execute(statement, data, (error, results) => {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.send({ message: "Phase Have been Deleted" })
        })
    }

}

export default new TodoController