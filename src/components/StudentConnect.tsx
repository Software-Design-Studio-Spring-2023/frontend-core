import React from "react";
import { currentUser } from "../pages/LoginForm";
import { LiveKitRoom } from "@livekit/components-react";

const StudentConnect = () => {
  return (
    <LiveKitRoom
      video={true}
      audio={false}
      token={`http://localhost:8080/api/get_student_token/${currentUser.id}`}
      connectOptions={{ autoSubscribe: false }}
      connect={true}
      serverUrl={"wss://eyedentify-90kai7lw.livekit.cloud"}
    />
  );
};

export default StudentConnect;
