import React, { PropTypes } from "react";
import { Loader } from "../../../component/loader";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import Form from "../../../component/form";
import { getAuthUser } from "../../../redux/actions/auth-actions";
import obj2arg from "graphql-obj2arg";
import { lang } from "../../../lib/lang";
import * as layoutActions from "../../../redux/actions/layout-actions";



export class BrowseStudentNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: null
    }

  }

  componentWillMount() {
    this.setState({ note: this.props.current_note })
  }

  render() {
    let hasNote = this.state.note && this.state.note.note;
    var view = <button
      onClick={() => {
        layoutActions.storeUpdateFocusCard(`Candidate's Note`, BrowseStudentNoteForm, {
          student_id: this.props.student_id,
          current_note: this.state.note,
          onSaved: (d) => {
            this.setState({ note: d });
          }
        });
      }}
      className={`btn btn-round-5 
      btn-block btn-sm
      text-bold ${hasNote ? 'btn-warning' : 'btn-grey'}`}>
      <i className="fa fa-sticky-note left" />
      {
        hasNote
          ? lang(`View Note`)
          : lang(`Add Note`)
      }
    </button>
    return view;
  }
}

BrowseStudentNote.propTypes = {
  student_id: PropTypes.number,
  current_note: PropTypes.object
};

BrowseStudentNote.defaultProps = {};

// ############################################################################
// ############################################################################
// ############################################################################
// ############################################################################

export class BrowseStudentNoteForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: null,

      formError: null,
      formSuccess: null,
      formLoading: false,
    }

  }

  componentWillMount() {
    this.setState({ note: this.props.current_note })
  }

  // fetch() {
  //   this.setState({ isLoadingFetch: true });

  //   let q = `query{user
  //     (
  //       ID:${this.props.student_id}, 
  //       company_id:${getAuthUser().rec_company}
  //     ) 
  //     {first_name last_name student_note{ID note} 
  //   }}`

  //   getAxiosGraphQLQuery(q).then(res => {
  //     let note = res.data.data.user.student_note;
  //     this.setState({ note: note, isLoadingFetch: false });
  //   });

  // }

  render() {
    var view = null;
    let props = {
      className: "form-row",
      items: [
        { header: `Add / Edit Note` },
        {
          name: "note",
          type: "textarea",
          rows: 10,
        }
      ],
      defaultValues: {
        note: this.state.note ? this.state.note.note : null
      },
      error: this.state.formError,
      success: this.state.formSuccess,
      disableSubmit: this.state.formLoading,
      submitText: "Save",
      onSubmit: (d) => {
        this.setState({ formLoading: true });

        let mutationQuery = "";
        let mutationKey = "";
        if (this.state.note) {
          let editParam = {
            ID: this.state.note.ID,
            note: d["note"],
            updated_by: getAuthUser().ID
          }
          mutationKey = "edit_user_note"
          mutationQuery = `mutation {edit_user_note (${obj2arg(editParam, { noOuterBraces: true })}) {ID note} }`;
        } else {

          let addParam = {
            user_id: this.props.student_id,
            company_id: getAuthUser().rec_company,
            note: d["note"],
            created_by: getAuthUser().ID
          }

          mutationKey = "add_user_note"
          mutationQuery = `mutation {add_user_note (${obj2arg(addParam, { noOuterBraces: true })}) {ID note} }`;
        }
        getAxiosGraphQLQuery(mutationQuery).then(res => {
          this.setState({ formLoading: false, formSuccess: "Note Saved", formError: null });
          this.props.onSaved(res.data.data[mutationKey]);
        }).catch(err => {
          this.setState({ formLoading: false, formSuccess: null, formError: err.toString() });
        })
      },
    }

    return <div style={{ padding: '20px 0px' }}>
      <Form {...props} />
    </div>;
  }
}

BrowseStudentNoteForm.propTypes = {
  student_id: PropTypes.number,
  current_note: PropTypes.obj,
  onSaved: PropTypes.func
};

BrowseStudentNoteForm.defaultProps = {
};
