import './Skills.css'
import pythonIcon from '../assets/icons/python.png'
import rIcon from '../assets/icons/icon-r.svg'
import pytorchIcon from '../assets/icons/icon-pytorch.svg'
import mysqlIcon from '../assets/icons/icon-mysql.svg'
import treeIcon from '../assets/icons/tree-structure.png'
import javaIcon from '../assets/icons/java.png'
import javascriptIcon from '../assets/icons/icon-javascript.svg'
import htmlIcon from '../assets/icons/icon-html5.svg'
import cssIcon from '../assets/icons/icon-css3.svg'
import figmaIcon from '../assets/icons/icon-figma.svg'
import scikitIcon from '../assets/icons/icon-scikit.svg'
import agentsIcon from '../assets/icons/icon-agents.svg'
import ragIcon from '../assets/icons/icon-rag.svg'
import typescriptIcon from '../assets/icons/icon-typescript.svg'
import reactIcon from '../assets/icons/icon-react.svg'
import nextIcon from '../assets/icons/icon-nextjs.svg'
import awsIcon from '../assets/icons/icon-aws.svg'
import gitIcon from '../assets/icons/icon-git.svg'

// Left column is the AI and data side, right column web, cloud and tooling.
const columns = [
  [
    { name: 'Python', level: 95, icon: pythonIcon },
    { name: 'PyTorch', level: 85, icon: pytorchIcon },
    { name: 'Scikit-learn', level: 85, icon: scikitIcon },
    { name: 'Fine tuning LLMs', level: 80, icon: pytorchIcon },
    { name: 'Training NNs', level: 60, icon: pytorchIcon },
    { name: 'AI Agents', level: 75, icon: agentsIcon },
    { name: 'RAG', level: 70, icon: ragIcon },
    { name: 'SQL', level: 85, icon: mysqlIcon },
    { name: 'R', level: 80, icon: rIcon },
    { name: 'Algorithms', level: 95, icon: treeIcon },
    { name: 'Figma', level: 75, icon: figmaIcon },
  ],
  [
    { name: 'JavaScript', level: 70, icon: javascriptIcon },
    { name: 'TypeScript', level: 75, icon: typescriptIcon },
    { name: 'React', level: 85, icon: reactIcon },
    { name: 'Next.js', level: 80, icon: nextIcon },
    { name: 'AWS', level: 75, icon: awsIcon },
    { name: 'Git', level: 90, icon: gitIcon },
    { name: 'HTML', level: 70, icon: htmlIcon },
    { name: 'CSS', level: 90, icon: cssIcon },
    { name: 'Java', level: 70, icon: javaIcon },
  ],
]

const Skill = ({ name, level, icon }) => (
  <div
    className="skill"
    data-reveal
    data-reveal-stagger
    style={{ '--level': `${level}%` }}
  >
    <img className="skill-icon" src={icon} alt="" width="42" height="42" />
    <div className="skill-info">
      <div className="skill-head">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{level}%</span>
      </div>
      <div className="skill-bar">
        <span className="skill-fill" />
      </div>
    </div>
  </div>
)

const Skills = () => {
  return (
    <section id="skills">
      <h2 className="section-heading skills-heading" data-reveal="left">
        Skills
      </h2>
      <div className="skills-grid">
        {columns.map((column, i) => (
          <div className="skills-column" key={i}>
            {column.map((skill) => (
              <Skill key={skill.name} {...skill} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
