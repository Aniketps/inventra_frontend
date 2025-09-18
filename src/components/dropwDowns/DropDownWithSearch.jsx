import { useState, useEffect, useRef } from 'react';

function DropDownWithSearch({ 
    // Support both naming conventions
    Options = [], 
    options = [], 
    OnSelect, 
    onChange, 
    Placeholder = "Select an option", 
    placeholder = "Select an option",
    value
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);
    
    // Normalize options to work with both naming conventions
    const normalizedOptions = Options.length > 0 ? 
        Options.map(opt => ({ 
            id: opt.ID, 
            name: opt.Name 
        })) : 
        options.map(opt => ({ 
            id: opt.value, 
            name: opt.label 
        }));

    useEffect(() => {
        if (value) {
            const selected = normalizedOptions.find(opt => String(opt.id) === String(value));
            if (selected) {
                setSelectedOption(selected);
            }
        } else {
            setSelectedOption(null);
        }
    }, [value]);
    
    // Filter options based on search term
    const filteredOptions = normalizedOptions.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle option selection
    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        setSearchTerm('');
        if (OnSelect) {
            OnSelect(option);
        }
        if (onChange) {
            onChange(option.id);
        }
    };

    return (
        <div className="dropdown w-100" ref={dropdownRef}>
            <div 
                className="form-control d-flex justify-content-between align-items-center" 
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer' }}
            >
                <span>{selectedOption ? selectedOption.name : (Placeholder || placeholder)}</span>
                <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
            </div>
            
            {isOpen && (
                <div className="dropdown-menu show w-100" style={{ position: 'absolute', zIndex: 1000 }}>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.name}
                                </button>
                            ))
                        ) : (
                            <div className="dropdown-item">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropDownWithSearch;