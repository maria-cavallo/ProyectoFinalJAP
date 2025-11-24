const db=require('../models/db');

exports.login=async(req,res)=>{
    const {email, password}=req.body;
    if(!email||!password){
        return res.status(400).json({ error: 'te faltaron cosas' });
    }
    try{
        const rows=await db.query(
            "SELECT * FROM users WHERE email=? AND password=?",
            [email,password]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'credenciales incorrectas' });
        }
        const user = rows[0];

        return res.json({
            success: true,
            user
        });
    }catch(err){
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }

}