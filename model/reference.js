import mongoose from 'mongoose';
const { Schema } = mongoose;

const referenceSchema = new Schema({ opaNumber: String });

export default mongoose.model('reference', referenceSchema);
