

const getAll = (req, res) => {
  users.getALLUsers((err, num_rows, results) => {
    if(err) return res.sendStatus(500)
    console.log("Number of Users: " + num_rows)
    return res.status(200).send(results)
  })
}