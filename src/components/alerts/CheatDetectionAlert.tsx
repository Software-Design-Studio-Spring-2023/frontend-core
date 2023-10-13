import { 
    Alert,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Button,
} from '@chakra-ui/react'
import { useRef } from "react";
import { User } from "../../hooks/useUsers";
import { useNavigate } from 'react-router-dom'

interface Props {
    handleCheatDetectedWarning: () => void;
    // user: User;
}

const CheatDetectionAlert = ({handleCheatDetectedWarning}:Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);
    const navigate = useNavigate();
    const jumptostream =()=> {
       // navigate(`/teacher/${user.id}`)
    }
    return (
        <>

            <Button
                colorScheme="teal"
                variant="solid"
                onClick={onOpen}
                size={/Android|iPhone/i.test(navigator.userAgent) ? "sm" : "md"}
            >
                Misconduct
            </Button>
            <AlertDialog
                motionPreset="scale"
                size={/Android|iPhone/i.test(navigator.userAgent) ? "xs" : "lg"}
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Misconduct Suspected!
                    </AlertDialogHeader>
                        <AlertDialogBody>
                            {`Miscoduct Suspected from student:`}
                            
                            {"\nView students camera?"}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            No
                        </Button>
                        <Button colorScheme="red" onClick={jumptostream} ml={3}>
                            Yes
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default CheatDetectionAlert