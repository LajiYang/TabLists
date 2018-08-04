import styles from './TabLists.module.scss';
import React from 'react';
import Animation from './Animation.js';

export default class TabLists extends React.Component {
    constructor(props) {
        super(props);
        this.element = {};
        this.parent = {};
        this.childs = [];
        this.count = 0;
        this.isFirstTime = true;
        this.lock = false;
    }

    componentDidMount() {
        let width = 0;
        this.element = this.rootRef.current;     
        this.parent = this.element.parentNode;
        this.borderAni = this.element.lastChild;
        this.childs = this.element.firstChild.childNodes;
        this.count = this.childs.length;

        for (let i = 0; i < this.count; i ++) {
            let cClientRect =  this.childs[i].getBoundingClientRect();
            width += cClientRect.width;
        }
        this.element.style.width = `${width}px`;
        this.moveTimeItems(this.props.activeTab);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.activeTab === this.props.activeTab) {
            return false;
        } else {
            return true;
        }
    }

    componentDidUpdate() {
        this.moveTimeItems(this.props.activeTab);
    }

    moveTimeItems = i => { 
        const left = this.childs[i].offsetLeft;
        const parScrollLeft = this.parent.scrollLeft;
        const parentWidth = this.parent.clientWidth;
        let scrollLeft = left - (parentWidth- this.childs[i].clientWidth) / 2;
        const d = Math.abs(scrollLeft - parScrollLeft);       
        //无动画或者第一次设置
        if (this.isFirstTime || !this.props.isAnimation) {
            this.isFirstTime = false;   
            this.parent.scrollLeft = scrollLeft;  
            this.borderAni.style.cssText = `
                width: ${this.childs[i].firstChild.clientWidth}px;
                transition: none;
                transform: translate(${left}px,0);
            `;
        } else { //有动画且非首次设置
            this.lock = true;
            this.borderAni.style.cssText = `
                width: ${this.childs[i].firstChild.clientWidth}px;
                transition: transform 0.3s;
                transform: translate(${left}px,0);
            `;
            const duration = Math.max(300, d / parentWidth * 1000);
            const aniProps = {
                from: parScrollLeft,
                to: scrollLeft,
                duration: duration, 
                cb: this.cb, 
                delay:300
            };
            new Animation(aniProps); 
        }
    }

    cb = (t, isend) => {
        if (isend) {
            this.lock = false;
            return;
        } else {
            this.parent.scrollLeft = t;
        }
    }

    onClick = (e, index) => {
        if(this.lock) return;
        if (index === this.props.activeTab) {
            this.moveTimeItems(index);
        } else {
            this.props.setActiveTab(index);
        }
    }

    rootRef = React.createRef();

    render() {
        const listItems = this.props.tabLists.map((item, index) => {
            return (
                <div
                    key={index}
                    index={index}
                    className={
                        index === this.props.activeTab
                            ? styles['activeTab']
                            : styles['others']
                    }
                    onClick={(e) => this.onClick(e, index)}
                >
                    <span>{item}</span>
                </div>
            );
        });
        return (
            <div className={styles['tabLists']}>
                <div 
                    className={styles['tabBlock']}>
                    <div 
                        className={styles['innerTabLists']}
                        ref={this.rootRef}
                    >   
                        <div className={styles['tabItems']}>
                            {listItems}
                        </div>
                        <div className={styles['borderAni']} />
                    </div>
                </div>
            </div>
        );
    }

}
