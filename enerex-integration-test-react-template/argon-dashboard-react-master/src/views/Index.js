import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { AuthContext } from '../AuthContext';

const Index = () => {
  const { token } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    id: 0,
    name: "",
    gender: "M",
    age: 0,
    education: "",
    academicYear: 0,
  });

  const [isAdding, setIsAdding] = useState(false);


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5290/api/Student/GetStudents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudents();
    } else {
      setLoading(false);
      setError("No token provided");
    }
  }, [token]);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setNewStudent({
        id: 0,
        name: "",
        gender: "M",
        age: 0,
        education: "",
        academicYear: 0,
      });
      setIsAdding(false);
    }
  };

  const handleEditClick = (student) => {
    setCurrentStudent(student);
    toggleModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewStudent({ ...newStudent, [name]: value });
    } else {
      setCurrentStudent({ ...currentStudent, [name]: value });
    }
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.put(`http://localhost:5290/api/Student/UpdateStudent/${currentStudent.id}`, currentStudent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === currentStudent.id ? currentStudent : student
        )
      );
      toggleModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await axios.post("http://localhost:5290/api/Student/AddStudent", newStudent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents((prevStudents) => [...prevStudents, response.data]);
      toggleModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5290/api/Student/DeleteStudent/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
      } catch (err) {
        setError(err.message);
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <Container className="mt-7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Students List</h3>
              </CardHeader>
              <Button color="primary" onClick={() => { setIsAdding(true); toggleModal(); }}>
                Add Student
              </Button>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Age</th>
                      <th scope="col">Academy Year</th>
                      <th scope="col">Education</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="align-items-center">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <th scope="row">{student.id}</th>
                        <td>{student.name}</td>
                        <td>{student.gender}</td>
                        <td>{student.age}</td>
                        <td>{student.academicYear}</td>
                        <td>{student.education}</td>
                        <td>
                          <Button color="info" size="sm" onClick={() => handleEditClick(student)}>
                            Edit
                          </Button>
                          <Button color="danger" size="sm" className="ml-2" onClick={() => handleDeleteStudent(student.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>


      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {isAdding ? "Add New Student" : "Edit Student"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={isAdding ? newStudent.name : currentStudent?.name || ""}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="gender">Gender</Label>
              <Input
                type="select"
                name="gender"
                id="gender"
                value={isAdding ? newStudent.gender : currentStudent?.gender || "M"}
                onChange={handleInputChange}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="age">Age</Label>
              <Input
                type="number"
                name="age"
                id="age"
                value={isAdding ? newStudent.age : currentStudent?.age || 0}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="education">Education</Label>
              <Input
                type="text"
                name="education"
                id="education"
                value={isAdding ? newStudent.education : currentStudent?.education || ""}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="academicYear">Academic Year</Label>
              <Input
                type="number"
                name="academicYear"
                id="academicYear"
                value={isAdding ? newStudent.academicYear : currentStudent?.academicYear || 0}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={isAdding ? handleAddStudent : handleUpdateStudent}>
            {isAdding ? "Add Student" : "Update Student"}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Index;