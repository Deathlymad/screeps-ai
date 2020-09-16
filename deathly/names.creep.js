module.exports = {
    name_first : [
        "James",
        "Mary",
        "John",
        "Patricia",
        "Robert",
        "Jennifer",
        "Michael",
        "Linda",
        "William",
        "Elizabeth",
        "David",
        "Barbara",
        "Richard",
        "Susan",
        "Joseph",
        "Jessica",
        "Thomas",
        "Sarah",
        "Charles",
        "Karen",
        "Christopher",
        "Nancy",
        "Daniel",
        "Lisa",
        "Matthew",
        "Margaret",
        "Anthony",
        "Betty",
        "Donald",
        "Sandra",
        "Mark",
        "Ashley",
        "Paul",
        "Dorothy",
        "Steven",
        "Kimberly",
        "Andrew",
        "Emily",
        "Kenneth",
        "Donna",
        "Joshua",
        "Michelle",
        "Kevin",
        "Carol",
        "Brian",
        "Amanda",
        "George",
        "Melissa",
        "Edward",
        "Deborah"
    ],
    name_last : [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Wilson",
        "Anderson",
        "Thomas",
        "Taylor",
        "Moore",
        "Jackson",
        "Martin",
        "Lee",
        "Perez",
        "Thompson",
        "White",
        "Harris",
        "Sanchez",
        "Clark",
        "Ramirez",
        "Lewis",
        "Robinson",
        "Walker",
        "Young",
        "Allen",
        "King",
        "Wright",
        "Scott",
        "Torres",
        "Nguyen",
        "Hill",
        "Flores",
        "Green",
        "Adams",
        "Nelson",
        "Baker",
        "Hall",
        "Rivera",
        "Campbell",
        "Mitchell",
        "Carter",
        "Roberts"
    ],
    name_prefix : [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Dr.",
        "Prof.",
        "Mr.",
        "Ms.",
        "Sir",
        "Lady"
    ],
    name_affix : [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Mc",
        "of "
    ],
    name_suffix : [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "I",
        "II",
        "III",
        "Sr.",
        "Jr."
    ],
    
    getRandomName : function() {
        name = ""
        prefix = module.exports.name_prefix[Math.round((module.exports.name_prefix.length - 1) * Math.random())]
        affix = module.exports.name_affix[Math.round((module.exports.name_affix.length - 1) * Math.random())]
        suffix = module.exports.name_suffix[Math.round((module.exports.name_suffix.length - 1) * Math.random())]
        first = module.exports.name_first[Math.round((module.exports.name_first.length - 1) * Math.random())]
        last = module.exports.name_last[Math.round((module.exports.name_last.length - 1) * Math.random())]
        
        name += prefix
        if (prefix.length > 0)
            name += " "
        
        name += first + " "
        
        name += affix
        name += last
        
        if (suffix.length > 0)
            name += " "
        name += suffix
        
        return name
    }
};