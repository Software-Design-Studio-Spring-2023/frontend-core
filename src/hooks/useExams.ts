//The User object and lift of users from the database are exported from here

import useData from "./useData";

export interface Exam {
    id: number;
    examName: string,
    has_started: boolean
}  



const useExams = () => useData<Exam>("/all_exams");

/* const {data, loading, error} = useExams();

const exams = data; */

export default useExams;
