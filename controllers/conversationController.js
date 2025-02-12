import Conversation from '../models/conversationModel.js'






export const createOrGetConversation = async (req, res) => {
    try {
        const {memberOneId, memberTwoId} = req.body;
        const conversation = await Conversation.findOne({
          memberOneId: memberOneId ,
          memberTwoId: memberTwoId
        }).populate({
          path: 'memberOne',
          populate: { path: 'profile', model: "User" }
        })
        .populate({
          path: 'memberTwo',
          populate: { path: 'profile', model: "User" }
        });
        if (!conversation) {
          const newConversation = await Conversation.create({
            memberOneId: memberOneId ,
            memberTwoId: memberTwoId
          });
          const populatedConversation = await newConversation.populate([
            { path: 'memberOne', populate: { path: 'profile', model: "User" } },
            { path: 'memberTwo', populate: { path: 'profile', model: "User" } }
          ]);
          res.status(200).json(populatedConversation)
          
        }
        
        res.status(200).json(conversation)

        
        
      } catch {
        return null;
      }
}


export const getCurrentConversation = async (req, res) => {
    
}