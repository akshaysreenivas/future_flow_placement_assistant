import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

function Alerts() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="success" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Hey, nice to see you</Alert.Heading>
        <p>
          "Welcome to Futureflow! To help keep your account and personal data
          secure, we kindly ask all new users to choose a strong, unique
          password on their first login. We take security seriously, and we're
          here to help you every step of the way!"
        </p>
      </Alert>
    );
  }
}

export default Alerts;
