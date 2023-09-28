import UserNavBar from "../../components/userNavbar/UserNavBar";
import Notifications from "../../components/notifications/Notifications";

function NotificationsPage() {
 
  return (
    <div className='user_page'>
    <UserNavBar user={true}/>
      <div className="user_page  d-flex  justify-content-center">  
          <Notifications/>
      </div>
    </div>
  );
}

export default NotificationsPage;
