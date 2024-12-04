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
import { AuthContext } from '../AuthContext'; // Asegúrate de que la ruta sea correcta

const Index = () => {
  const { token } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

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

  const toggleModal = () => setModal(!modal);

  const handleEditClick = (student) => {
    setCurrentStudent(student);
    toggleModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.put(`http://localhost:5290/api/Student/UpdateStudent/${currentStudent.id}`, currentStudent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Actualiza la lista de estudiantes después de la edición
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

  const handleDeleteStudent = async (studentId) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this student?");

    if (confirmDelete) {

      try {

        await axios.delete(`http://localhost:5290/api/Student/DeleteStudent/${studentId}`, {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        });

        // Actualiza la lista de estudiantes después de la eliminación

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
                          <Button color="danger" size="sm" className="ml-2" onClick={()=> handleDeleteStudent(student.id)}>
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
      {/* Modal para editar estudiante */}
<Modal isOpen={modal} toggle={toggleModal}>
  <ModalHeader toggle={toggleModal}>Edit Student</ModalHeader>
  <ModalBody>
    {currentStudent && (
      <Form>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={currentStudent.name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="gender">Gender</Label>
          <Input
            type="select"
            name="gender"
            id="gender"
            value={currentStudent.gender}
            onChange={handleInputChange}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="age">Age</Label>
          <Input
            type="number"
            name="age"
            id="age"
            value={currentStudent.age}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="age">Academy Year</Label>
          <Input
            type="number"
            name="academicYear"
            id="academicYear"
            value={currentStudent.academicYear}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="education">Education</Label>
          <Input
            type="text"
            name="education"
            id="education"
            value={currentStudent.education}
            onChange={handleInputChange}
          />
        </FormGroup>
      </Form>
    )}
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={handleUpdateStudent}>
      Update
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