import { useState } from "react";

const initialData = {
  title: "",
  description: "",
  mediaURL: "",
  mediaIsImage: false,
}

const CreateExercise: React.FC = () => {
  const [data, setData] = useState(initialData);
  const submitData = () => {}

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.type === "checkbox" ? (e.currentTarget as HTMLInputElement).checked : e.currentTarget.value;
    setData({
      ...data,
      [name]: value,
    })
  }

  return (
    <div>
      <form onSubmit={submitData} >
        <h2>Add new exercise to database</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Exercise title</label>
          <input autoFocus onChange={handleInput} type="text" placeholder="Exercise title" id="title" name="title" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Exercise description</label>
          <textarea onChange={handleInput} cols={30} placeholder="Exercise description" rows={3} id="description" name="description" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mediaURL">Link for image / video</label>
          <input onChange={handleInput} type="url" placeholder="Exercise image / vide URL" id="mediaURL" name="mediaURL" />
        </div>
        <div className="mb-4">
          <label htmlFor="mediaIsImage">Is media image?</label>
          <input onChange={handleInput} type="checkbox" id="mediaIsImage" name="mediaIsImage" />
        </div>
        <input disabled={!data.title} type="submit" value="Create" />
      </form>
    </div>
  )
}

export default CreateExercise;