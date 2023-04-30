import { MdNotifications } from "react-icons/md";
import "./Notification.css";
import { useEffect, useState } from "react";
import { CloseButton } from "react-bootstrap";
import {
  clearNotification,
  getNotifications,
  markAsRead,
} from "../../services/userServices";
import { toast } from "react-toastify";

function Notification() {
  const [state, setstate] = useState();
  const [unread, setUnread] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getNotifications()
      .then((data) => {
        if (data.status) {
          setstate(
            data.result?.notification?.map((data) => ({
              ...data,
              loading: false,
            }))
          );
          setUnread(data.result.count);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong");
      });
  }, []);

  const handleShow = () => {
    setShow(!show);

    markAsRead().then((data) => {
      if (data.status) {
        setUnread();
      }
    });
  };
  return (
    <div className="noti_parent_div">
      <div
        onClick={handleShow}
        className="notfication_icon_div me-auto pointer"
      >
        <MdNotifications color="blue" size={23} />
        {unread > 0 && (
          <span className="badge notfication_pill rounded-pill badge-notification bg-danger">
            <small>{unread}</small>
          </span>
        )}
      </div>
      <div className={show ? " notifi-box" : "d-none"}>
        <div className="notify_box_contents border-3 border-top border-warning mt-2">
          <div className="d-flex  align-items-center bg-white noti-heading px-3 mb-1 justify-content-between py-2">
            <h6 className="text-primary m-0">Notifications</h6>
            <button
              onClick={() => setShow(false)}
              className="rounded px-2  border-0 text-primary "
            >
              Close
            </button>
          </div>
          {state?.length ? (
            state.map((item) => {
              // deleting notifications
              const handleclear = () => {
                // calling api
                clearNotification(item._id)
                  .then((data) => {
                    if (data.status) {
                      const newState = state.filter(
                        (noti) => noti._id !== item._id
                      );
                      setstate(newState);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    toast.error("Something Went Wrong");
                  });
              };
              return (
                <div
                  key={item._id}
                  className={
                    "notifi-item border-2 border-success border px-3 py-2 " +
                    (!item.isRead ? "read_bg" : "bg-white")
                  }
                >
                  <div className="text">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-primary">{item.notification_type}</h5>
                      <CloseButton
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        data-bs-title="delete Notification"
                        onClick={handleclear}
                      />
                    </div>
                    <p>{item.message}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="notifi-item d-flex justify-content-center p-5 ">
              <h6 className="lead">No New Notifications ):</h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
