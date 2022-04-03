// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  fetch(`https://meebits.larvalabs.com/meebit/${req.query.id}`)
    .then((res) => res.json())
    .then((json) => {
      res.status(200).json(json)
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error' })
    })
}
