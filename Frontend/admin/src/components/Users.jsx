import React, { useState,useEffect } from "react";
import {BsFillTrashFill, BsFillPencilFill} from 'react-icons/bs'
import { setShowUserModal } from "../slices/modalSlice";
import { useSelector,useDispatch } from "react-redux";
import UserModal from "./UserModal";
import axios from 'axios'
import Urls from "../../constants/Urls";
import { setToken,setLoginState } from "../slices/authSlice";
import {useTable} from 'react-table'
import Pagination from "./pagination";

const Users = () => {
   const [rows, setRows] = useState([]);  
   const [modalPropId,setModalPropId] = useState(null)
   const [currentPage,setCurrentPage] = useState(1)
   const [rowsPerPage,setRowsPerPage] = useState(10)
   const {showUserModal} = useSelector(state=>state.modal)
   const { route } = useSelector((state) => state.nav);
   const dispatch = useDispatch();
  
  
  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   useTable({
  //     columns: [
  //       { Header: "ID", accessor: "id" },
  //       { Header: "Phone Number", accessor: "phonenumber" },
  //       { Header: "Email", accessor: "email" },
  //       { Header: "First Name", accessor: "firstname" },
  //       { Header: "Last Name", accessor: "lastname" },
  //       { Header: "Profile Picture", accessor: "url" },
  //       { Header: "Rating", accessor: "rating" },
  //       { Header: "Edit", accessor: "id" }, // Assuming you have an EditCell component for the Edit column
  //     ],
  //     rowss,
  //   });

  useEffect(()=>{
    const fetchUsers = async()=>{
      try{
        const response = await axios.get(
          `http://${Urls.admin}/admin/user/get/all`
        );
        if(response.data){
          setRows(response.data)
          console.log(response.data)
        }
      }catch(err){
        console.log("error in useEffect fetchUsers: ",err)
        if (err.response && err.response.status === 403) {
          // Dispatch actions to update authentication state
          dispatch(setLoginState(false));
          dispatch(setToken(""));
          localStorage.setItem("token", "");
        }
      }
    }
    fetchUsers()
  },[route])

const lastRowIndex = currentPage * rowsPerPage
  const firstRowIndex = lastRowIndex - rowsPerPage
  const currentRows = rows.slice(firstRowIndex,lastRowIndex)

  return (
    <div className="ml-[10%] p-8">
      <div className="flex flex-col space-y-6 py-12 px-14 bg-white border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Users</h2>
        <table className="w-full border" >
          <thead>
            {/* {headerGroups.map((hg) => (
              <tr {...hg.getHeaderGroupProps()} className="bg-gray-200">

                {
                  hg.headers.map((header)=>(
                    <th {...header.getHeaderProps()}>
                      {header.render("Header")}
                    </th>
                  ))
                }

              </tr>
            ))} */}
            <tr className="bg-gray-200">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Phone Number</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">First Name</th>
              <th className="py-2 px-4">Last Name</th>
              <th className="py-2 px-4">Profile Picture</th>
              <th className="py-2 px-4">Rating</th>
              <th className="py-2 px-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 transition"
                onClick={() => console.log(row.id)}
              >
                <td className="py-2 px-4">{row.id}</td>
                <td className="py-2 px-4">{row.phonenumber}</td>
                <td className="py-2 px-4">{row.email}</td>
                <td className="py-2 px-4">{row.firstname}</td>
                <td className="py-2 px-4">{row.lastname}</td>
                <td className="py-2 px-4">
                  <img
                    src={
                      row.url ||
                      "https://pbs.twimg.com/profile_images/1438817879332425730/anYBmFZz_400x400.jpg"
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                <td className="py-2 px-4">4.6</td>

                <td className="py-2 px-4">
                  <span
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      dispatch(setShowUserModal(!showUserModal));
                      console.log(row.id);
                      setModalPropId(row.id);
                    }}
                  >
                    <BsFillPencilFill />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <Pagination totalRows={rows.length} rowsPerPage={rowsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
        <UserModal id={modalPropId} />
      </div>
    </div>
  );
};

export default Users;
