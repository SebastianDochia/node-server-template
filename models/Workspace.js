const mongoose = require('mongoose');
const slugify = require('slugify');

const WorkspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true,
        maxlenght: [35, 'Name cannot be more than 30 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlenght: [250, 'Description cannot be more than 250 characters']
    },
    year: {
        type: Number,
        required: [true, 'Year is required']
    },
    series: {
        type: String,
        required: [true, 'Series is required']
    },
    group: {
        type: Number,
        required: [true, 'Group is required']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    members: [String],
    isStarted: {
        type: Boolean,
        default: false
    },
    connectedUsers: [String]
});

// Create bootcamp slug from name
WorkspaceSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);