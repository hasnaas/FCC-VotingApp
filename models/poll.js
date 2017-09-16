var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var PollSchema=Schema({
    title:{type:String,required:true},
    options:Schema.Types.Mixed,
    owner:{type:Schema.Types.ObjectId,ref:'User'},
    u_voters:[Schema.Types.ObjectId],
    a_voters:[String]
    
});

module.exports=mongoose.model("Poll",PollSchema);

