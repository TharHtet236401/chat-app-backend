import AsyncRedis from "async-redis";

const RedisDB = AsyncRedis.createClient();

// Error handling for Redis connection
RedisDB.on("error", (err) => {
    console.error("Redis error:", err);
});

export const setObj = async (id, obj) => {
    try {
        await RedisDB.set(id.toString(), JSON.stringify(obj));
    } catch (error) {
        console.error("Error setting object in Redis:", error);
    }
};

export const getObj = async (id) => {
    try {
        const data = await RedisDB.get(id.toString());
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error getting object from Redis:", error);
        return null;
    }
};

export const delObj = async (id) => {
    try {
        await RedisDB.del(id.toString());
    } catch (error) {
        console.error("Error deleting object from Redis:", error);
    }
};

// New functions for handling offline messages and socket mappings
export const storeOfflineMessage = async (userId, message) => {
    try {
        await RedisDB.rpush(`offline_messages:${userId}`, JSON.stringify(message));
    } catch (error) {
        console.error("Error storing offline message:", error);
    }
};

export const getOfflineMessages = async (userId) => {
    try {
        const messages = await RedisDB.lrange(`offline_messages:${userId}`, 0, -1);
        await RedisDB.del(`offline_messages:${userId}`);
        return messages.map(msg => JSON.parse(msg));
    } catch (error) {
        console.error("Error getting offline messages:", error);
        return [];
    }
};

export const setUserSocket = async (userId, socketId) => {
    try {
        await RedisDB.set(`user_socket:${userId}`, socketId);
    } catch (error) {
        console.error("Error setting user socket:", error);
    }
};

export const getUserSocket = async (userId) => {
    try {
        return await RedisDB.get(`user_socket:${userId}`);
    } catch (error) {
        console.error("Error getting user socket:", error);
        return null;
    }
};

export const removeUserSocket = async (userId) => {
    try {
        await RedisDB.del(`user_socket:${userId}`);
    } catch (error) {
        console.error("Error removing user socket:", error);
    }
};

export default RedisDB;