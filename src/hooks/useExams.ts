//The User object and lift of users from the database are exported from here

import useData from "./useData";

export interface Exam {
    id: number;
    examName: string,
    has_started: boolean
}  

const useExams = () => useData<Exam>("/all_exams");

export default useExams
