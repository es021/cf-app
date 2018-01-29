import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Loader} from '../../../component/loader';
import {getAxiosGraphQLQuery} from '../../../../helper/api-helper';
import {DocLinkEnum, UserEnum} from '../../../../config/db-config';
import ProfileCard from '../../../component/profile-card';
import PageSection from '../../../component/page-section';
import {CustomList} from '../../../component/list';
import * as layoutActions from '../../../redux/actions/layout-actions';
import CompanyPopup from './company-popup';

export default class UserPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            loading: true,
        }
    }

    componentWillMount() {
        var id = null;

        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }

        console.log("UserPage", "componentWillMount");
        var query = (this.props.role === UserEnum.ROLE_STUDENT)
                ? `query {
              user(ID:${id}) {
                ID
                user_email
                first_name
                last_name
                description
                role
                skills{label}
                doc_links{label url type}
                img_url
                img_pos
                img_size
                university
                phone_number
                graduation_month
                graduation_year
                major
                minor
            }}`
                : `query {
              user(ID:${id}) {
                ID
                user_email
                first_name
                last_name
                description
                role
                img_url
                img_pos
                img_size
                rec_position
                rec_company
                company{name}
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return {data: res.data.data.user, loading: false}
            })
        });
    }

    getBasicInfo(d) {

        var items = [{
                label: "Email",
                icon: "envelope",
                value: d.user_email
            }];

        if (d.role === UserEnum.ROLE_RECRUITER) {
            items.push({
                label: "Company",
                icon: "suitcase",
                value: <a onClick={() => layoutActions.storeUpdateFocusCard(d.company.name, CompanyPopup, {id: d.rec_company})}>
                    {d.company.name}
                </a>
                }, {
                    label: "Position",
                    icon: "black-tie",
                    value: d.rec_position
                });

            }

            if (d.role === UserEnum.ROLE_STUDENT) {
                items.push({
                    label: "Phone Number",
                    icon: "phone",
                    value: d.phone_number
                });

                // major --------------------------------
                var major = null;
                try {
                    var list = JSON.parse(d.major);
                    if (list.length > 0) {
                        major = <CustomList className="empty" items={list}></CustomList>
                    }
                } catch (err) {
                    major = d.major;
                }

                if (major !== null) {
                    items.push({label: "Major",
                        icon: "graduation-cap",
                        value: major
                    });
                }

                // minor --------------------------------
                var minor = null;
                try {
                    var list = JSON.parse(d.minor);
                    if (list.length > 0) {
                        minor = <CustomList className="empty" items={list}></CustomList>
                    }
                } catch (err) {
                    minor = d.minor;
                }

                if (minor !== null) {
                    items.push({label: "Minor",
                        icon: "graduation-cap",
                        value: minor
                    });
                }

                items.push({
                    label: "University",
                    icon: "university",
                    value: d.university
                }, {
                    label: "Expected Graduation",
                    icon: "calendar",
                    value: `${d.graduation_month} ${d.graduation_year}`
                });
            }

            return <CustomList className="icon" items={items}></CustomList>;
        }

        getRecruiterBody(user) {
            //about
            const basic = this.getBasicInfo(user);
            var pcBody = <div>
            <PageSection title="About" body={basic}></PageSection>
        </div>;

            return pcBody;
        }

        getStudentBody(user) {
            //about
            const basic = this.getBasicInfo(user);

            //document and link
            var dl = user.doc_links.map((d, i) => {
                var icon = (d.type === DocLinkEnum.TYPE_DOC) ? "file-text" : "link";
                return <span><i className={`fa left fa-${icon}`}></i>
                    <a target='_blank' href={`${d.url}`}>{`${d.label} `}</a>
                </span>;
            });
            const doc_link = <CustomList className="label" items={dl}></CustomList>;

            // skill
            var s = user.skills.map((d, i) => d.label);
            const skills = <CustomList className="label" items={s}></CustomList>;

            var dl = null;
            var pcBody = <div>
            <PageSection title="About" body={basic}></PageSection>
            <PageSection title="Document & Link" body={doc_link}></PageSection>
            <PageSection title="Skills" body={skills}></PageSection>
        </div>;

            return pcBody;
        }

        render() {
            var id = null;
            var user = this.state.data;
            var view = null;
            console.log(user);
            if (this.state.loading) {
                view = <Loader size='3' text='Loading Student Information...'></Loader>
            } else {

                var pcBody = (this.props.role === UserEnum.ROLE_STUDENT)
                        ? this.getStudentBody(user)
                        : this.getRecruiterBody(user);

                view = <div>
                <ProfileCard type="student" 
                             title={user.first_name} subtitle={user.last_name}
                             img_url={user.img_url} img_pos={user.img_pos} img_size={user.img_size}
                             body={pcBody}></ProfileCard>
            </div>;
            }

            return (view);
        }
    };

    UserPopup.propTypes = {
        id: PropTypes.number.isRequired,
        role: PropTypes.string
    };

    UserPopup.defaultProps = {
        role: UserEnum.ROLE_STUDENT
    };