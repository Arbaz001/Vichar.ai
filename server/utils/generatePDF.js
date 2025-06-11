const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Idea = require('../models/Idea');
const Comment = require('../models/Comment');

const generateIdeaPDF = async (ideaId, userId) => {
  try {
    // Fetch idea with user and votes data
    const idea = await Idea.findById(ideaId)
      .populate('user', 'username email')
      .populate('votes', 'username');

    if (!idea) {
      throw new Error('Idea not found');
    }

    // Check permissions
    if (idea.visibility === 'private' && !idea.user._id.equals(userId)) {
      throw new Error('Not authorized to export this idea');
    }

    // Fetch comments
    const comments = await Comment.find({ idea: ideaId })
      .populate('user', 'username')
      .sort('-createdAt');

    // Create PDF document
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));

    // Add content to PDF
    // Header
    doc.fontSize(20)
       .text(idea.title, { align: 'center', underline: true })
       .moveDown(0.5);

    // Metadata
    doc.fontSize(12)
       .fillColor('#333333')
       .text(`Author: ${idea.user.username}`, { continued: true })
       .text(`  •  Created: ${idea.createdAt.toLocaleDateString()}`, { align: 'right' })
       .moveDown(0.3);

    doc.fontSize(10)
       .text(`Visibility: ${idea.visibility}  •  Votes: ${idea.votes.length}  •  Tags: ${idea.tags.join(', ')}`)
       .moveDown(1);

    // Description
    doc.fontSize(14)
       .text('Description:', { underline: true })
       .moveDown(0.3);
       
    doc.fontSize(10)
       .text(idea.description, { align: 'justify' })
       .moveDown(1);

    // Comments Section
    if (comments.length > 0) {
      doc.addPage()
         .fontSize(14)
         .text(`Comments (${comments.length})`, { underline: true })
         .moveDown(0.5);

      comments.forEach((comment, index) => {
        doc.fontSize(10)
           .text(`#${index + 1} by ${comment.user.username} on ${comment.createdAt.toLocaleString()}`)
           .text(comment.content)
           .moveDown(0.8);
      });
    }

    // Footer
    doc.fontSize(8)
       .text(`Generated on ${new Date().toLocaleString()} • Ideas Incubator API`, { align: 'center' });

    doc.end();

    // Return PDF as buffer
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

module.exports = { generateIdeaPDF };