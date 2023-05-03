function BasicinfoView({ user }) {
  return (
    <div>
    <div className=" px-5 d-flex align-items-center gap-2">
    <img
      className="mx-2 border-black rounded-circle"
      src="/user_default.avif"
      width={25}
      alt=""
    />
        <h3>
          Basic Information
        </h3>
      </div>
      <div className="basicInfo  rounded bg-white px-5">
        <div>
          <div className="info">
            <span>Email Address</span>
            <p> {user?.email}</p>
          </div>
          <div className="info">
            <span>Phone Number</span>
            <p> {user?.phone}</p>
          </div>
          <div className="info">
            <span>Personnel Website</span>
            <p> {user?.website} </p>
          </div>
        </div>
        <div>
          <div className="info">
            <span>Gender</span>
            <p>{user?.gender}</p>
          </div>
          <div className="info">
            <span>Address</span>
            <p> {user.location ? user.location?.district + "," + user.location?.state 
            : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicinfoView;
