import AsyncRedis from "async-redis"
const RedisDB = AsyncRedis.createClient()

// Error handling for Redis connection
RedisDB.on("error", (err) => {
    console.error("Redis error:", err);
});

export const setObj = async(id,obj)=>{
    try {
        await RedisDB.set(id.toString(),JSON.stringify(obj))
    } catch (error) {
        console.error("Error setting object in Redis:", error);
    }
}
    
export const getObj = async(id)=>{
    try {
        const data = await RedisDB.get(id.toString());
        return data ? JSON.parse(data) : null; // Return null if no data found
    } catch (error) {
        console.error("Error getting object from Redis:", error);
        return null; // Return null on error
    }
}

export const delObj = async(id)=>{
    try {
        await RedisDB.del(id.toString())
    } catch (error) {
        console.error("blah blabh redis :", error);//changed the texts
    }
}