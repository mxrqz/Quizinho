import { customAlphabet } from 'nanoid';

// Custom alphabet without similar looking characters
const nanoid = customAlphabet('abcdefghijkmnpqrtwxyzABCDEFGHJKLMNPQRTUVWXYZ', 5);

export const generateId = () => nanoid();

export default nanoid;