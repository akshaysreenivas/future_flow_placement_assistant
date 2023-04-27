import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

function Alerts({ data }) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert
        className="m-0"
        variant="success"
        onClose={() => setShow(false)}
        dismissible
      >
        <Alert.Heading>Hey, {data}</Alert.Heading>
        <p className="m-0">
          "Welcome to Futureflow! To help keep your account and personal data
          secure, we kindly ask all new users to choose a strong, unique
          password on their first login. We take security seriously
        </p>
      </Alert>
    );
  }
}

export default Alerts;
