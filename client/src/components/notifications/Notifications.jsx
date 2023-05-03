import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import {
  clearNotification,
  getNotifications,
  markAsRead,
} from "../../services/userServices";
import "./Notifications.css";
function Notifications() {
  const [state, setstate] = useState();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    // fetching All notifications
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

    return () => {
      markAsRead().then((data) => {
        if (data.status) {
          setUnread();
        }
      });
    };
  }, []);

  return (
    <div className="notifi_parent_div m-3 rounded">
      <div className="noti-heading p-2 mb-2 ">
        <h6 className="text-primary m-2">Notifications</h6>
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
                  <MdDelete
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
        <div className=" d-flex justify-content-center p-5 mx-2">
          <h6 className="lead">No New Notifications ):</h6>
        </div>
      )}
    </div>
  );
}

export default Notifications;
