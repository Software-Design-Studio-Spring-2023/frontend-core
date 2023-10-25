import { Exam } from "./useExams";
import useExams from "./useExams";


let currentExam:Exam;

const setCurrentExam = () => {
    const { data, loading, error} = useExams();
     
    currentExam = data.find((obj) => obj.id === 112); 
    
}


export default currentExam;