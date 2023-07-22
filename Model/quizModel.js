const mongoose = require("mongoose")

const validTypeOfQuiz = ["quizOfLesson", "quizOfUnit", "quizOfSemester", "other"];

const Schema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() // Generate a new ObjectId as the default value
      },
    quizName:{
        type:String,
        required: [true, "Product name is required"],
    },
    quizType :{
        type: Number,
        required: [true, "Product Price is required"],
    },
    quizDescription:{
      type:String,
      required: [true, "Product description is required"],    
    },
    noOfQuestions:{
        type: Number,
        required: [true, ""]
    },
    educationalLevel:{
      type: String,
      enum: validEducationalLevel,
      required: [true, "Educational level is required"],
    },
    semester :{
      type: String,
      enum: validSemester,
      required: [true, "semester is required"],
  }
})


mongoose.model("quizzes",Schema); //new name for model