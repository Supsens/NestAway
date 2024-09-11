import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
const Contact = ({listing}) => {
    const [Landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchLandlord = async () => {
            
            try {
                const response = await fetch(`/api/user/${listing.userRef}`)
                const data = await response.json()
                setLandlord(data)
            } catch (error) {
                console.log(error)
            }

        }

        fetchLandlord()
    }, [listing.userRef])
  return (
    <div>
      {Landlord !== null && (
        <div className='flex flex-col'>
          <p>
            Contact <span className='fon
            t-semibold'>
                {Landlord?.username}
            </span>
            for <span className='fon
            t-semibold'>{listing.name.toLowerCase()}</span>
          </p>

          <textarea name='message' id='message' rows='2' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type a message' className='w-full border p-3 rounded-lg mt-2'>

          </textarea>

          <Link to={`mailto:${Landlord?.email}?Subject=${listing.name}&body=${message}`}>
              <button className='bg-blue-600 text-white rounded-full py-3 px-4 text-lg font-semibold mt-6 w-full'>Send Message</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Contact
