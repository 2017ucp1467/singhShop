import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import AdminUserEditModal from "../components/AdminUserEditModal";
import {
  getUserList,
  deleteUser,
  getUserByAdmin,
} from "../features/user/adminUserSlice";
import { useNavigate } from "react-router-dom";

function UserListPage() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    userList,
    success: successDelete,
    userDetail,
  } = useSelector((state) => state.admin);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getUserList());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  const deleteUserHandler = (id) => {
    console.log("user deleted");
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const updateUserHandler = (id) => {
    if (!userDetail || userDetail._id !== id) {
      dispatch(getUserByAdmin(id));
    }
    setShowModal(true);
  };

  return (
    <div>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: "green" }}></i>
                  ) : (
                    <i className='fas fa-x' style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {/* <LinkContainer to={`/admin/user/${user._id}`}> */}
                  <Button
                    variant='light'
                    className='btn-sm'
                    onClick={() => updateUserHandler(user._id)}
                  >
                    <i className='fas fa-edit'></i>
                  </Button>
                  {/* </LinkContainer> */}
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteUserHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <AdminUserEditModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default UserListPage;
