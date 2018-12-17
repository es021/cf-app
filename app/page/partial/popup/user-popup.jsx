import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { DocLinkEnum, UserEnum, LogEnum, PrescreenEnum } from '../../../../config/db-config';
import { ImgConfig } from '../../../../config/app-config';
import ProfileCard from '../../../component/profile-card';
import PageSection from '../../../component/page-section';
import { CustomList, createIconLink } from '../../../component/list';
import * as layoutActions from '../../../redux/actions/layout-actions';
import { isRoleRec, getAuthUser, isRoleAdmin } from '../../../redux/actions/auth-actions';
import CompanyPopup from './company-popup';
import { addLog } from '../../../redux/actions/other-actions';
import { openSIAddForm } from '../activity/scheduled-interview';
import { Gallery } from '../../../component/gallery';

export function createUserMajorList(major) {
    var r = null;

    try {
        r = "";
        major = JSON.parse(major);
        major.map((d, i) => {
            if (i > 0) {
                r += ", ";
            }
            r += d;
        });
    } catch (err) {
        r = major;
    }

    return r;

}
// isIconOnly will only consider label with label style set in DocLinkEnum
export function createUserDocLinkList(doc_links, student_id, alignCenter = true, isIconOnly = false, isSimple = false) {
    //document and link
    var ret = null;
    const onClickDocLink = () => {
        addLog(LogEnum.EVENT_CLICK_USER_DOC, student_id);
    };

    var dl = [];
    var doc_link = null;

    if (isIconOnly) {
        doc_links.map((d, i) => {
            if (d == null) return;

            var style = DocLinkEnum.LABEL_STYLE[d.label];
            if (style && dl.length < 4) {
                d.icon = style.icon;
                d.color = style.color;
                dl.push(d);
            }
        });
        ret = createIconLink("sm", dl, alignCenter, onClickDocLink, "No Document Or Links Uploaded");

    } else if (isSimple) {
        ret = doc_links.map((d, i) => {
            if (d == null) return;

            return <a target='_blank' href={`${d.url}`}>{`${d.label} `}</a>;
        });
    } else {
        dl = doc_links.map((d, i) => {
            if (d == null) return;

            var icon = (d.type === DocLinkEnum.TYPE_DOC) ? "file-text" : "link";
            return <span><i className={`fa left fa-${icon}`}></i>
                <a target='_blank' href={`${d.url}`}>{`${d.label} `}</a>
            </span>;
        });
        ret = <CustomList className={"label"}
            emptyMessage={"No Document Or Links Uploaded"}
            alignCenter={alignCenter} items={dl}
            onClick={onClickDocLink}>
        </CustomList>

    }


    return ret;
}

export default class UserPopup extends Component {
    constructor(props) {
        super(props)

        this.authUser = getAuthUser();

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

        this.id = id;

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
                rec_position
                rec_company
                company{name}
                skills{label}
                doc_links{label url type}
                img_url
                img_pos
                img_size
                university
                phone_number
                graduation_month
                graduation_year
                available_month
                available_year
                looking_for
                major
                minor
                description
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
                return { data: res.data.data.user, loading: false }
            })
        });
    }

    isValueEmpty(val){
        if(val == null || val == ""){
            return true;
        }
        return false;
    }

    getBasicInfo(d) {
        var notSpecifed = <small><i className="text-muted">Not Specified</i></small>;

        var items = [{
            label: "Email",
            icon: "envelope",
            value: d.user_email
        }];

        if (d.role === UserEnum.ROLE_RECRUITER) {
            if (d.company !== null) {
                items.push({
                    label: "Company",
                    icon: "suitcase",
                    value: <a onClick={() => layoutActions.storeUpdateFocusCard(d.company.name, CompanyPopup, { id: d.rec_company })}>
                        {d.company.name}
                    </a>
                }, {
                        label: "Position",
                        icon: "black-tie",
                        value: (d.rec_position) ? d.rec_position
                            : <span className="text-muted">Position Not Specified</span>
                    });

            } else {
                items.push({
                    label: "Company",
                    icon: "suitcase",
                    value: <span className="text-muted">No Company</span>
                });
            }
        }

        if (d.role === UserEnum.ROLE_STUDENT) {
            items.push({
                label: "Phone Number",
                icon: "phone",
                value: this.isValueEmpty(d.phone_number) ? notSpecifed :  d.phone_number
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
            
            items.push({
                label: "Major",
                icon: "graduation-cap",
                value: this.isValueEmpty(major) ? notSpecifed :  major
            });
         
            // if (major !== null) {
            //     items.push({
            //         label: "Major",
            //         icon: "graduation-cap",
            //         value: major
            //     });
            // }

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
                items.push({
                    label: "Minor",
                    icon: "graduation-cap",
                    value: minor
                });
            }

            items.push(
                {
                    label: "University",
                    icon: "university",
                    value: this.isValueEmpty(d.university) ? notSpecifed :  d.university
                }, {
                    label: "Expected Graduation",
                    icon: "calendar",
                    value: this.isValueEmpty(d.graduation_month) ? notSpecifed :`${d.graduation_month} ${d.graduation_year}`
                }
                // , {
                //     label: "Work Availability Date",
                //     icon: "suitcase",
                //     value: this.getWorkAvailable(d.available_month, d.available_year)
                // }
            );

            items.push({
                label: "Looking For",
                icon: "search",
                value: this.isValueEmpty(d.looking_for) ? notSpecifed :  d.looking_for
            });
            
            // if (d.looking_for !== null) {
            //     items.push({
            //         label: "Looking For",
            //         icon: "search",
            //         value: d.looking_for
            //     });
            // }

        }

        return <CustomList className="icon" items={items}></CustomList>;
    }

    getWorkAvailable(m, y) {
        if (m) {
            if (m == y) {
                return m;
            } else {
                return `${m} ${y}`;
            }
        } else {
            return <span className="text-muted">Not Specified</span>;
        }

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

        //schedule interview jenis lama for pre screen maybe
        // only admin can access
        var si_btn = isRoleAdmin()
            ? <div><a
                className="btn btn-blue" onClick={() => {
                    openSIAddForm(this.props.id, this.authUser.rec_company, PrescreenEnum.ST_PROFILE)
                }}>
                <i className="fa fa-comments left"></i>
                Schedule For Session
            </a></div>
            : null;

        var doc_link = null;

        // if (this.props.isSessionPage) {
        //     doc_link = createUserDocLinkList(user.doc_links, this.id);
        // } else {
        //     var doc_link = this.getDocLinks(user.doc_links);
        //     if (doc_link == null) {
        //         doc_link = <div className="text-muted">Nothing To Show Here</div>
        //     }
        // }
        doc_link = createUserDocLinkList(user.doc_links, this.id);

        // skill
        var s = user.skills.map((d, i) => d.label);
        const skills = <CustomList className="label" items={s}></CustomList>;

        var dl = null;
        var pageClassName = (this.props.isSessionPage) ? "" : "left"
        var leftBody = <div>{si_btn}
            <PageSection title="About" className={pageClassName} body={basic}></PageSection>
        </div>;
        var rightBody = <div>
            <PageSection className={pageClassName} title="Attachments" body={doc_link}></PageSection>
            <PageSection className={pageClassName} title="Skills" body={skills}></PageSection>
            {(user.description != "" && user.description != null) ?
                <PageSection maxHeight={143} className={pageClassName} title="More Info" body={<p>{user.description}</p>}></PageSection>
                : null
            }
        </div>;

        if (this.props.isSessionPage) {
            return <div>{leftBody}{rightBody}</div>
        } else {
            return {
                left: leftBody,
                right: rightBody
            };
        }

    }

    getBanner() {
        var data = this.state.data;
        data.banner_url = "";
        data.banner_position = "";
        data.banner_url = "";

        const isInvalid = (d) => {
            if (typeof d === "undefined" || d == "" || d == null || d == "null") {
                return true;
            }

            return false;
        }

        data.banner_url = isInvalid(data.banner_url) ? ImgConfig.DefUserBanner : data.banner_url;
        var style = {
            backgroundImage: "url(" + data.banner_url + ")",
            backgroundSize: isInvalid(data.banner_size) ? "" : data.banner_size,
            backgroundPosition: isInvalid(data.banner_position) ? "center center" : data.banner_position,
        };

        return <div className="fc-banner" style={style}></div>;
    }

    getDocLinks(doc_links) {
        if (doc_links.length <= 0) {
            return null;
        }

        var iframe = [];
        var link = [];

        // separate document and link
        for (var i in doc_links) {

            var item = doc_links[i];
            var isIframe = item.type == DocLinkEnum.TYPE_DOC || item.url.containText("youtube");

            if (isIframe) {
                iframe.push(item);
            } else {
                link.push(item);
            }
        }


        return <div>
            <Gallery data={link} size="lg"></Gallery>
            <br></br>
            <Gallery data={iframe} size="lg"></Gallery>
        </div>
    }


    render() {
        var id = null;
        var user = this.state.data;
        var view = null;
        if (this.state.loading) {
            view = <Loader size='3' text='Loading Student Information...'></Loader>
        } else {

            var userBody = (this.props.role === UserEnum.ROLE_STUDENT)
                ? this.getStudentBody(user)
                : this.getRecruiterBody(user);

            var profilePic = <div>
                <ProfileCard type="student"
                    title={<h3>{user.first_name}<br></br><small>{user.last_name}</small></h3>}
                    img_url={user.img_url} img_pos={user.img_pos} img_size={user.img_size}
                    body={null}></ProfileCard>
            </div>;

            if (this.props.role === UserEnum.ROLE_STUDENT && !this.props.isSessionPage) {
                view = <div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12 com-pop-left" style={{marginBottom:"-25px"}}>
                                <div className="com-pop-pic">{profilePic}</div>
                            </div>
                            <div className="col-md-6">
                                {userBody.left}
                            </div>
                            <div className="col-md-6">
                                {userBody.right}
                            </div>
                        </div>
                    </div>
                    {this.getBanner()}
                </div>;
            } else {
                view = <div>
                    <ProfileCard type="student"
                        title={user.first_name} subtitle={user.last_name}
                        img_url={user.img_url} img_pos={user.img_pos} img_size={user.img_size}
                        body={userBody}></ProfileCard>
                </div>;
            }

        }

        return (view);
    }
};

UserPopup.propTypes = {
    id: PropTypes.number.isRequired,
    role: PropTypes.string,
    isSessionPage: PropTypes.bool
};

UserPopup.defaultProps = {
    role: UserEnum.ROLE_STUDENT,
    isSessionPage: false
};