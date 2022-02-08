import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Link } from 'react-router-dom';
import moment from 'moment';
import countriesWithCodes from 'base/data/countriesData';
import styles from './_course-learners-list.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';

let cx = classNames.bind(styles);

class CourseLearnersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allLearnersLoaded: this.props.allLearnersLoaded
    };
    this.paginationLoadMore = this.paginationLoadMore.bind(this);
    this.isCurrentCourse = this.isCurrentCourse.bind(this);
  }

  isCurrentCourse = (course) => {
    return course.get('course_id') === this.props.courseId
  }

  paginationLoadMore = () => {
    this.props.apiFetchMoreLearnersFunction()
  }

  componentDidMount() {
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props !== nextProps) {
      this.setState({
        allLearnersLoaded: nextProps.allLearnersLoaded
      })
    }
  }

  /** Render the learners list for the course page

   API endpoint source of data:
     figures/api/users-detail/?enrolled_in_course_id=<course-id>
   */
  render() {

    const learnersRender = this.props.learnersData.map((user, index) => {
      const courseSpecificData = user.getIn(['courses']).find(this.isCurrentCourse) ? user.getIn(['courses']).find(this.isCurrentCourse) : Immutable.List();

      return (
        <li key={index} className={styles['learner-row']}>
          <span className={styles['name']}><Link to={'/figures/user/' + user.getIn(['id'])}>{user.getIn(['name'])}</Link></span>
          <span className={styles['country']}>{countriesWithCodes[user.getIn(['country'], 'ND')]}</span>
          <span className={styles['date-enrolled']}>{moment(courseSpecificData.getIn(['date_enrolled'])).format('LL')}</span>
          <span className={styles['course-completed']}>{courseSpecificData.getIn(['progress_data', 'course_completed'], false) && <FontAwesomeIcon icon={faCheck} className={styles['completed-icon']} />}</span>
          <span className={styles['date-completed']}>{courseSpecificData.getIn(['progress_data', 'course_completed'], false) ? moment(courseSpecificData.getIn(['progress_data', 'course_completed'])).format('LL') : '-'}</span>
          <span className={styles['course-progress']}>{(courseSpecificData.getIn(['progress_data', 'course_progress'], 0)*100).toFixed(2)}%</span>
          <span className={styles['course-progress-sections-completed']}>
            {courseSpecificData.getIn(['progress_data', 'course_progress_details', 'sections_worked']) ? courseSpecificData.getIn(['progress_data', 'course_progress_details', 'sections_worked']).toFixed(0) : '-'}/{courseSpecificData.getIn(['progress_data', 'course_progress_details', 'sections_possible']) ? courseSpecificData.getIn(['progress_data', 'course_progress_details', 'sections_possible']).toFixed(0) : '-'}
          </span>
          <span className={styles['course-progress-points-earned']}>
            {courseSpecificData.getIn(['progress_data', 'course_progress_details', 'points_earned']) ? courseSpecificData.getIn(['progress_data', 'course_progress_details', 'points_earned']).toFixed(1) : '-'}/{courseSpecificData.getIn(['progress_data', 'course_progress_details', 'points_possible']) ? courseSpecificData.getIn(['progress_data', 'course_progress_details', 'points_possible']).toFixed(1) : '-'}
          </span>
        </li>
      )
    })

    return (
      <section className={styles['course-learners-list']}>
        <div className={styles['header']}>
          <div className={styles['header-title']}>
            {this.props.listTitle}
          </div>
        </div>
        <div className={cx({ 'stat-card': true, 'span-2': false, 'span-3': false, 'span-4': true, 'learners-table-container': true})}>
          <ul className={styles['learners-table']}>
            <li key="header" className={styles['header-row']}>
              <span className={styles['name']}>Learner</span>
              <span className={styles['country']}>Country</span>
              <span className={styles['date-enrolled']}>Date Enrolled</span>
              <span className={styles['course-completed']}>Course Certificate Issued</span>
              <span className={styles['date-completed']}>Course Certificate Date Issued</span>
              <span className={styles['course-progress']}>Graded Assignment Progress</span>
              <span className={styles['course-progress-completed']}>Graded Assignments Completed</span>
              <span className={styles['course-progress-earned']}>Graded Assignment Points Earned</span>
            </li>
            {learnersRender}
          </ul>
          {!this.state.allLearnersLoaded && <button className={styles['load-more-button']} onClick={() => this.paginationLoadMore()}>Load more</button>}
        </div>
      </section>
    )
  }
}

CourseLearnersList.defaultProps = {
  listTitle: 'Per learner info:',
}

CourseLearnersList.propTypes = {
  listTitle: PropTypes.string,
  courseId: PropTypes.string,
};

export default CourseLearnersList;
