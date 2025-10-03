import './filterbar.css'

export default function FilterBar({ order, setOrder, userFilter, setUserFilter, onRefresh }) {
  return (
    <div className="filterbar">
      <div className="filterbar-controls">
        <input
          className="input"
          placeholder="Filter by user"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}   
        />
        <select
          className="select"
          value={order}
          onChange={(e) => setOrder(e.target.value)}        
        >
          <option value="desc">New first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>
      <button className="btn" onClick={onRefresh}>Update</button>
    </div>
  )
}
