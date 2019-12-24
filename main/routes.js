var express = require("express")
var router = express.Router()
var pool = require("./db")

router.get("/hello", (req, res) => {
    res.json("hello world")
})

/*
    POSTS ROUTE SECTION
*/
//working 100%
router.get("/api/get/allposts", (req, res, next) => {
    pool.query(`SELECT * FROM posts ORDER BY date_created DESC;`,
        (q_err, q_res) => {
            res.json(q_res.rows)
        })
})

//working 100%
router.get('/api/get/post', (req, res, next) => {
    const post_id = String(req.body.post_id)

    pool.query(`SELECT * FROM posts WHERE pid = '${post_id}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
        })
})
//working 100%
// router.post("/api/post/posttodb", (req, res, next) => {
//     const title = String(req.body.title)
//     const body = String(req.body.body)
//     const uid = String(req.body.uid)
//     const username = String(req.body.username)
//     pool.query(`INSERT INTO posts(title, body, user_id, author, date_created) VALUES('${title}', '${body}', '${uid}', '${username}', 'NOW()');`,
//         (q_err, q_res) => {
//             if (q_err) return next(q_err);
//             res.json(q_res.rows)
//         })
// })
//working 100%
router.post("/api/post/posttodb", (req, res, next) => {
    const body_vector = String(req.body.body)
    const title_vector = String(req.body.title)
    const username_vector = String(req.body.username)

    const search_vector = [title_vector, body_vector, username_vector]

    const title = String(req.body.title)
    const body = String(req.body.body)
    const uid = String(req.body.uid)
    const username = String(req.body.username)
    pool.query(`INSERT INTO posts(title, body, search_vector, user_id, author, date_created) VALUES('${title}', '${body}', to_tsvector('${search_vector}'), '${uid}', '${username}', 'NOW()');`,
        (q_err, q_res) => {
            if (q_err) return next(q_err);
            res.json(q_res.rows)
        })
})

//working 100%
router.get('/api/get/searchpost', (req, res, next) => {
    const search_query = String(req.query.search_query)

    pool.query(`SELECT * FROM posts WHERE search_vector @@ to_tsquery($1)`, [search_query],
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res.rows)
        })
})

//working 100%
router.put("/api/put/post", (req, res, next) => {
    const title = String(req.body.title)
    const body = String(req.body.body)
    const user_id = String(req.body.uid)
    const pid = String(req.body.pid)
    const username = String(req.body.username)
    pool.query(`UPDATE posts SET title = '${title}', body = '${body}', user_id = '${user_id}', author = '${username}', date_created = 'NOW()' WHERE pid = '${pid}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
            console.log(q_err)
        })
})
//working 100%
router.delete("/api/delete/postcomments", (req, res, next) => {
    const post_id = String(req.body.post_id)
    pool.query(`DELETE FROM comments WHERE post_id = '${post_id}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
            console.log(q_err)
        })
})
//working 100%
router.delete("/api/delete/post", (req, res, next) => {
    const post_id = String(req.body.post_id)
    pool.query(`DELETE FROM posts WHERE pid = '${post_id}';`,
        (q_err, q_res) => {
            res.json("q_res.rows")
            console.log(q_err)
        })
})
//working 100%
router.put('/api/put/likes', (req, res, next) => {
    const uid = [req.body.uid]
    const post_id = String(req.body.post_id)

    const values = [uid, post_id]
    console.log(values)
    pool.query(`UPDATE posts
                SET like_user_id = like_user_id || $1, likes = likes + 1
                WHERE NOT (like_user_id @> $1)
                AND pid = ($2)`,
        values, (q_err, q_res) => {
            if (q_err) return next(q_err);
            console.log(q_res)
            res.json(q_res.rows);
        });
});

/*
    COMMENTS ROUTES SECTION
*/
//working 100%
router.post("/api/post/commenttodb", (req, res, next) => {
    const comment = String(req.body.comment)
    const user_id = String(req.body.user_id)
    const username = String(req.body.username)
    const post_id = String(req.body.post_id)
    pool.query(`INSERT INTO comments(comment, user_id, author, post_id, date_created ) VALUES('${comment}', '${user_id}', '${username}', '${post_id}', 'NOW()');`,
        (q_err, q_res) => {
            res.json("comment added")
            console.log(q_err)
        })
})

//working 100%
router.put("/api/put/commenttodb", (req, res, next) => {
    const comment = String(req.body.comment)
    const user_id = String(req.body.user_id)
    const post_id = String(req.body.post_id)
    const username = String(req.body.username)
    const cid = String(req.body.cid)
    pool.query(`UPDATE comments SET comment = '${comment}', user_id = '${user_id}', post_id= '${post_id}', author = '${username}', date_created = 'NOW()' WHERE cid = '${cid}';`,
        (q_err, q_res) => {
            res.json("updating comment")
            console.log(q_err)
        })
})
//working 100%
router.delete("/api/delete/comment", (req, res, next) => {
    const cid = String(req.body.cid)
    pool.query(`DELETE FROM comments WHERE cid = '${cid}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
            console.log(q_err)
        })
})
//working 100%
router.get("/api/get/allpostcomments", (req, res, next) => {
    console.log("post id is : ", req.query.post_id)
    const post_id = String(req.query.post_id)
    pool.query(`SELECT * FROM comments WHERE post_id = '${post_id}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
            console.log(q_err)
        })
})

/*
    USER PROFILE SECTION
*/

//working 100%
router.post("/api/post/userprofiletodb", (req, res, next) => {
    const nickname = String(req.body.profile.nickname)
    const email = String(req.body.profile.email)
    const email_verfied = String(req.body.profile.email_verified)

    pool.query(`INSERT INTO users(username, email, email_verified, date_created) VALUES('${nickname}', '${email}', '${email_verfied}', 'NOW()') ON CONFLICT DO NOTHING;`,
        (q_err, q_res) => {
            res.json(q_res)
            console.log("name added to database", q_res)
        })
})

//working 100%
router.get("/api/get/userprofilefromdb", (req, res, next) => {
    // we can use email instead 
    // const email = [ "%" + req.query.email + "%"]
    const query = req.query.email
    const email = String(query)
    pool.query(`SELECT * FROM users WHERE email = '${email}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
            console.log(q_res.rows)
            console.log(q_err)
        })
})

// working 100%
router.get("/api/get/userposts", (req, res, next) => {
    const query = req.query.user_id
    const user_id = String(query)
    console.log(user_id)
    pool.query(`SELECT * FROM posts WHERE user_id = '${user_id}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
            console.log(q_err)
        })
})



/*
   Retrieve another users profile from db based on username 
*/

router.get('/api/get/otheruserprofilefromdb', (req, res, next) => {
    // const email = [ "%" + req.query.email + "%"]
    const username = String(req.query.username)
    console.log(username)
    pool.query(`SELECT * FROM users
                WHERE username = '${username}';`,
        (q_err, q_res) => {
            res.json(q_res.rows)
            console.log(q_err)
        });
});

//Get another user's posts based on username
router.get('/api/get/otheruserposts', (req, res, next) => {
    const username = String(req.query.username)
    pool.query(`SELECT * FROM posts
                WHERE author = '${username}';`,
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res.rows)
        });
});

/*
    MESSAGES SECTION
*/
router.post("/api/post/messagetodb", (req, res, next) => {
    const from_username = String(req.body.message_sender)
    const to_username = String(req.body.message_to)
    const title = String(req.body.title)
    const body = String(req.body.body)

    const values = [from_username, to_username, title, body]
    console.log(values)

    pool.query(`INSERT INTO messages(message_sender, message_to, message_title, message_body, date_created)
                VALUES ($1, $2, $3, $4, NOW());`,
        values, (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res)
        })
})

router.get('/api/get/usermessages', (req, res, next) => {
    const username = String(req.query.username)
    console.log(username)
    pool.query(`SELECT * FROM messages WHERE message_to = '${username}';`,
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res.rows)
        })
})

router.delete('/api/delete/usermessage', (req, res, next) => {
    const mid = String(req.query.mid)

    pool.query(`DELETE FROM messages WHERE mid = '${mid}';`,
        (q_res, q_err) => {
            console.log(q_err)
            res.json(q_res)
        })
})
/*
    APPOINTMENTS SECTION
*/

router.post('/api/post/appointment', (req, res, next) => {
    const values = [req.body.title, req.body.start_time, req.body.end_time]
    pool.query(`INSERT INTO appointments(title, start_time, end_time) VALUES($1, $2, $3);`,
        values, (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res.rows)
        });
});

router.get('/api/get/allappointments', (req, res, next) => {
    pool.query(`SELECT * FROM appointments;`,
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res.rows)
        })
})

/*
    Admin User Mangment
*/

router.get('/api/get/allusers', (req, res, next) => {
    pool.query(`SELECT * FROM users;`,
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res.rows)
        })
})

router.delete('/api/delete/usercomments', (req, res, next) => {
    const uid = req.body.uid
    pool.query(`DELETE FROM comments WHERE user_id = $1;`, [uid],
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res)
        })
})

router.get('/api/get/user_postid', (req, res, next) => {
    const uid = req.body.uid
    console.log('UID IN USERPOST_ID ', uid)
    pool.query(`SELECT pid FROM posts WHERE user_id = $1;`, [uid],
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res.rows)
        })
})

router.delete('/api/delete/userpostcomments', (req, res, next) => {
    const post_id = req.body.post_id
    pool.query(`DELETE FROM comments WHERE post_id = $1;`, [post_id],
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res)
        })
})

router.delete('/api/delete/userposts', (req, res, next) => {
    const uid = req.body.uid
    pool.query(`DELETE FROM posts WHERE user_id = $1;`, [uid],
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res)
        })
})

router.delete('/api/delete/user', (req, res, next) => {
    const uid = req.body.uid
    pool.query(`DELETE FROM users WHERE uid = $1;`, [uid],
        (q_err, q_res) => {
            console.log(q_err)
            res.json(q_res)
        })
})


module.exports = router