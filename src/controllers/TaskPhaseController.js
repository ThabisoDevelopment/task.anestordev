import dayjs from "dayjs"
import connection from "../database/connection"

class TaskPhaseController {

    async index(request, response) {
        try {
            const statement = "SELECT * FROM task_phases WHERE task_id=? AND user_id=? ORDER BY created_at ASC"
            const data = [ request.params.task_id, request.user.id ]
            const { [0]: results } = await connection.promise().query(statement, data)
            results.forEach(async phase => {
                phase.created_at = dayjs(phase.created_at).format("DD-MMM-YYYY")
                phase.updated_at = dayjs(phase.updated_at).format("DD-MMM-YYYY")
                return phase
            })
            response.send(results)
        } catch (error) {
            response.status(500).send({ message: error.message })
        }
    }

    show(request, response) {
        const statement = "SELECT * FROM task_phases WHERE id=? AND user_id=?"
        const data = [ request.params.id, request.user.id ]
        connection.execute(statement, data, (error, results) => {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            if (results.length < 1) return response.status(404).send({ message: "sorry! This task phase does not exist" })
            results[0].created_at = dayjs(results[0].created_at).format("DD-MMM-YYYY")
            results[0].updated_at = dayjs(results[0].updated_at).format("DD-MMM-YYYY")
            response.send(results[0])
        })
    }

    create(request, response) {
        if (!request.body.name) return response.status(422).send({ message: "The name of phase is required" })
        const data = [
            request.user.id,
            request.params.task_id,
            request.body.name,
            request.body.description,
        ]
        const statement = "INSERT INTO task_phases(user_id, task_id, name, description) VALUES(?, ?, ?, ?)"
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.status(201).send({
                message: "New Phase has been created",
                phase_id: results.insertId
            })
        })
    }

    update(request, response) {
        if (!request.body.name) return response.status(422).send({ message: "The name of the task is required" })
        const data = [
            request.body.name,
            request.body.description,
            request.params.id,
            request.user.id,
        ]
        const statement = `UPDATE task_phases SET name=?, description=? WHERE id=? AND user_id=?`
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.status(200).send({
                message: "Phase has been updated",
                phase_id: request.params.id
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
        const statement = "UPDATE task_phases SET completed=? WHERE id=? AND user_id=?"
        connection.execute(statement, data , (error, results)=> {
            if (error) return response.status(501).send({ message: error })
            response.status(200).send({
                message: "Phase has been updated",
                phase_id: request.params.id,
                completed: request.body.completed
            })
        })
    }

    destroy(request, response) {
        const statement = "DELETE FROM task_phases WHERE id=? AND user_id=?"
        const data = [request.params.id, request.user.id]
        connection.execute(statement, data, (error, results) => {
            if (error) return response.status(501).send({ message: "Internal Server Error" })
            response.send({ message: "Phase Have been Deleted" })
        })
    }

}

export default new TaskPhaseController