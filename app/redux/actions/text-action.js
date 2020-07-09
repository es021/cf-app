import {
    CFSMeta
} from '../../../config/db-config';
import {
    getCfCustomMeta
} from './auth-actions';


export function _student_single() {
    return getCfCustomMeta(CFSMeta.TEXT_STUDENT_ENTITY_SINGLE, "Student");
}
export function _student_plural() {
    return getCfCustomMeta(CFSMeta.TEXT_STUDENT_ENTITY_PLURAL, "Students");
}
export function _student_single_lower() {
    return _student_single().toLowerCase();
}
export function _student_plural_lower() {
    return _student_plural().toLowerCase();
}
