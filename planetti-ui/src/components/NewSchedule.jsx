import React from "react";
import Form from "../components/common/Form";
import {
  DropdownButton,
  Dropdown,
  Button,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { newSchedule } from "../services/scheduleService";
import styles from "../assets/css/delete-account.module.css";
import Joi from "joi";
//import  CreateUI  from "../components/CreateUI";

import ColorPicker from "../components/ColorPicker";
const todayDate = new Date();

class NewSchedule extends Form {
  state = {
    data: {
      title: "",
      start_date: "",
      end_date: "",
      description: "",
    },
    customFields: [],
    selectedOption: null,
    chosenColor: "#16a3a3",
    showDatePicker: false,
    errors: {},
  };

  schema = Joi.object({
    description: Joi.string().allow(""),
    title: Joi.string().required(),
    start_date: Joi.date().allow(""),
    end_date: Joi.date().min(Joi.ref("start_date")).allow(""),
  });

  backToUserpage = () => {
    this.props.history.push("/");
  };

  routeChange = (path) => {
    this.props.history.push("/view-schedule/" + path);
  };

  createUI = () => {
    return this.state.customFields.map((el, i) => (
      <div key={i}>
        <div className="form-group">
          <div className={styles.wrapRow}>
            <InputGroup>
              <FormControl
                placeholder="Your fields name in schedule"
                aria-label="Your fields name in schedule"
                aria-describedby="basic-addon2"
                name={el.value + " "}
                onChange={(e) => this.handleChangesInput(e, i)}
              />
              <DropdownButton
                focusFirstItemOnShow={true}
                as={InputGroup.Append}
                variant="outline-secondary"
                title={this.state.customFields[i].type}
                id="input-group-dropdown-2"
                onSelect={(e) => this.handleChangeSelect(e, i)}
              >
                <Dropdown.Item eventKey="number">Numbers</Dropdown.Item>
                <Dropdown.Item eventKey="email">Email</Dropdown.Item>
                <Dropdown.Item eventKey="text">Text</Dropdown.Item>
                <Dropdown.Item eventKey="url">URL</Dropdown.Item>
              </DropdownButton>
              <InputGroup.Prepend>
                <InputGroup.Text>Mandatory?</InputGroup.Text>
                <InputGroup.Checkbox
                  aria-label="Checkbox for following text input"
                  name="mandatory"
                  type="checkbox"
                  defaultChecked={false}
                  checked={el.mandatory}
                  onChange={(e) => this.handleCheckBox(e, i)}
                />
              </InputGroup.Prepend>
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  type="button"
                  value="remove"
                  onClick={this.removeClick.bind(this, i)}
                >
                  Delete
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
      </div>
    ));
  };

  handleChangesInput = (e, i) => {
    let customFields = [...this.state.customFields];
    customFields[i] = {
      ...customFields[i],
      label: e.target.value,
      name: e.target.value,
    };
    this.setState({ customFields });
  };

  handleChangeSelect = (e, i) => {
    let customFields = [...this.state.customFields];
    customFields[i] = { ...customFields[i], type: e, label: e };
    this.setState({ customFields });
  };

  handleCheckBox = (e, i) => {
    let customFields = [...this.state.customFields];
    customFields[i] = { ...customFields[i], mandatory: e.target.checked };
    this.setState({ customFields });
  };

  addClick = () => {
    let id = this.state.customFields.length + 1;
    let setDefaults = { id: id, type: "text" };
    this.setState((prevState) => ({
      customFields: [...prevState.customFields, setDefaults],
    }));
  };

  removeClick = (i) => {
    let customFields = [...this.state.customFields];
    customFields.splice(i, 1);
    this.setState({ customFields });
  };

  doSubmit = async () => {
    let customFieldsSpread = [...this.state.customFields];
    const userInfo = localStorage.getItem("userInfo");
    const { user_id } = JSON.parse(userInfo);
    let scheduleData = {
      title: this.state.data.title,
      description: this.state.data.description,
      user_id: user_id,
      schedule_config: {
        maxDate: this.state.data.end_date,
        minDate: this.state.data.start_date,
        fields: customFieldsSpread,
      },
      schedule_color: this.state.chosenColor,
    };
    let { data } = await newSchedule(scheduleData);
    let responseUuid = data[0].uuid;
    this.routeChange(responseUuid);
  };

  chooseColor = (color) => {
    this.setState({ chosenColor: color });
  };

  //Handler for data boxes, if checkbox is checked, change state to today date.
  DatePickerHandler = () => {
    if (this.state.showDatePicker) {
      this.setState((prevState) => ({
        showDatePicker: false,
        data: {
          ...prevState.data,
          start_date: "",
          end_date: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        showDatePicker: true,
        data: {
          ...prevState.data,
          start_date: todayDate.toISOString().slice(0, 10),
          end_date: todayDate.toISOString().slice(0, 10),
        },
      }));
    }
  };

  render() {
    return (
      <div className={styles.createPageContainer}>
        <form onSubmit={null}>
          <div>
            <div>
              <div className="form-group">
                <label>Give your schedule a Title</label>
                <input
                  className="form-control"
                  value={this.state.data.title || ""}
                  onChange={(e) =>
                    this.setState((prevState) => ({
                      data: {
                        ...prevState.data,
                        title: e.target.value,
                      },
                    }))
                  }
                />
                {this.state.errors.title && (
                  <small className="text-danger">
                    {this.state.errors.title}
                  </small>
                )}
                <label>
                  Please give a short description if you want (Optional)
                </label>
                <input
                  className="form-control"
                  value={this.state.data.description || ""}
                  onChange={(e) =>
                    this.setState((prevState) => ({
                      data: {
                        ...prevState.data,
                        description: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
            <div>{this.createUI()}</div>
          </div>
        </form>
        <Button className="btn-info" onClick={(e) => this.addClick(e)}>
          Add more custom inputs
        </Button>
        <form action={null}>
          <div>
            <ColorPicker
              chooseColor={this.chooseColor}
              chosenColor={this.state.chosenColor}
            />
            <div className="form-group">
              Want to have custom schedule duration?{" "}
              <input
                type="checkbox"
                name="showDatePicker"
                checked={this.state.showDatePicker}
                onChange={() => {
                  this.DatePickerHandler();
                }}
              />
              {this.state.showDatePicker && (
                <div>
                  <div>
                    {this.state.errors.start_date && (
                      <small className="text-danger">
                        {this.state.errors.start_date}
                      </small>
                    )}
                  </div>
                  <label>Start date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={this.state.data.start_date}
                    onChange={(e) =>
                      this.setState((prevState) => ({
                        data: {
                          ...prevState.data,
                          start_date: e.target.value,
                        },
                      }))
                    }
                  />
                  <div>
                    {this.state.errors.end_date && (
                      <small className="text-danger">
                        {this.state.errors.end_date}
                      </small>
                    )}
                    <label> End date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={this.state.data.end_date}
                      onChange={(e) =>
                        this.setState((prevState) => ({
                          data: {
                            ...prevState.data,
                            end_date: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <div className={styles.buttonBar}>
                <Button className={styles.cancel} onClick={this.backToUserpage}>
                  Back
                </Button>
                <Button
                  className="btn-success"
                  onClick={(e) => this.handlesubmit(e)}
                >
                  Create this schedule
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default NewSchedule;
